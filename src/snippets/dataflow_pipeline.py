# Cloud Dataflow (Apache Beam) Preprocessing Reference Template
# This script defines a batch preprocessing pipeline that runs locally (DirectRunner)
# or on Cloud Dataflow (DataflowRunner) to clean and transform datasets.

import apache_beam as beam
from apache_beam.options.pipeline_options import PipelineOptions
from apache_beam.options.pipeline_options import SetupOptions


# =========================================================================
# 1. DEFINE CUSTOM TRANSFORMATIONS (DoFn)
# =========================================================================
class CleanAndParseRow(beam.DoFn):
    """Custom DoFn to clean, validate, and parse raw CSV string rows."""
    
    def process(self, element, delimiter=','):
        """Processes a single line of a CSV file.
        
        Args:
            element: A string representing a raw CSV line.
        Yields:
            A dictionary containing parsed and typed features.
        """
        # Skip CSV Header
        if element.startswith("customer_id") or not element.strip():
            return
            
        try:
            # Parse row elements
            parts = element.split(delimiter)
            customer_id = parts[0].strip()
            age = int(parts[1].strip())
            spend = float(parts[2].strip())
            country = parts[3].strip()
            
            # Feature engineering: Filter out invalid rows (Data Quality Check)
            if age <= 0 or spend < 0:
                print(f"Skipping row due to invalid metrics: {element}")
                return
            
            # Format row output as structured dictionary
            yield {
                "customer_id": customer_id,
                "age": age,
                "spend": spend,
                "country": country.upper(),
                # Engineer new feature: Is high spender?
                "is_high_spender": 1 if spend > 500.0 else 0
            }
            
        except (ValueError, IndexError) as e:
            # In production, route bad records to a dead-letter queue (GCS or BigQuery)
            print(f"Malformed row skipped: {element}. Error: {e}")
            return


# =========================================================================
# 2. CONSTRUCT THE PIPELINE
# =========================================================================
def run_pipeline(argv=None):
    """Construct and run the Apache Beam pipeline."""
    
    # Configure pipeline arguments. 
    # For local testing, run with: python dataflow_pipeline.py
    # For Dataflow, run with: python dataflow_pipeline.py --runner=DataflowRunner --project=YOUR_PROJECT --temp_location=gs://YOUR_BUCKET/temp
    options = PipelineOptions(argv)
    
    # Save the main session state (imports and global vars) so workers can access them
    options.view_as(SetupOptions).save_main_session = True

    # Initialize the Pipeline context
    with beam.Pipeline(options=options) as p:
        
        # Step 1: Read raw files from Cloud Storage or Local Directory
        raw_rows = p | "ReadFromSource" >> beam.io.ReadFromText("input_data.csv")
        
        # Step 2: Apply CleanAndParseRow DoFn to filter and transform rows
        cleaned_records = raw_rows | "CleanAndFormat" >> beam.ParDo(CleanAndParseRow())
        
        # Step 3: Format the dictionary records back to CSV-style strings for output
        formatted_outputs = (
            cleaned_records 
            | "FormatCSVString" >> beam.Map(
                lambda r: f"{r['customer_id']},{r['age']},{r['spend']},{r['country']},{r['is_high_spender']}"
            )
        )
        
        # Step 4: Write output back to GCS (or use beam.io.WriteToBigQuery for database loading)
        formatted_outputs | "WriteToGCS" >> beam.io.WriteToText(
            "gs://your-bucket-name/preprocessed/output",
            file_name_suffix=".csv",
            shard_name_template=""  # Empty prevents default sharding formatting
        )


if __name__ == "__main__":
    run_pipeline()
