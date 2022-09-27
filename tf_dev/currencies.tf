provider "aws" {
  region = "us-east-1"
}

resource "aws_dynamodb_table" "ddbtable" {
  name             = "currencies-dev"
  hash_key         = "id"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  attribute {
    name = "id"
    type = "S"
  }
}

data "archive_file" "zip_the_nodejs_code" {
  type        = "zip"
  source_dir  = "${path.module}/../dist"
  output_path = "${path.module}/currencies-dev.zip"
}


resource "aws_lambda_function" "myLambda" {
  depends_on = [data.archive_file.zip_the_nodejs_code]
  source_code_hash = "${path.module}/currencies-dev.zip"
  filename         = "${path.module}/currencies-dev.zip"
  function_name    = "currencies-dev"
  role             = "arn:aws:iam::207627709836:role/service-role/lambda-IAM-role"
  handler          = "index.handler"
  runtime          = "nodejs16.x"
}