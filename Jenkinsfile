pipeline {

    parameters {
        string(name: 'environment', defaultValue: 'aws', description: 'Workspace for the deployment')
        booleanParam(name: 'AutoApprove', defaultValue: true, description: 'Approval Setting')
    }


    environment {
        AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
        NPM_TOKEN = credentials('NPM_TOKEN')
    }

    agent any

    stages {
        stage('Code Build') {
            steps {
                sh "npm config set '//npm.pkg.github.com/:_authToken' "${NPM_TOKEN}""
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('TF - Init') {
            steps {
                sh 'pwd; cd tf_dev; terraform init -input=false'
            }
        }

        stage('TF - Plan') {
            steps {
                sh 'cd tf_dev; terraform workspace select ${environment} || terraform workspace new ${environment} '
                sh 'cd tf_dev; terraform plan -input=false -out tfplan'
                sh 'cd tf_dev; terraform show -no-color tfplan > tfplan.txt'
                }
            }


        stage('Deploy - Dev') {
            steps {
                sh 'cd tf_dev; terraform apply -input=false  tfplan'
            }
        }
    }
}