pipeline {
    parameters {
        string(name: 'environment', defaultValue: 'aws', description: 'Workspace for the deployment')
        booleanParam(name: 'AutoApprove', defaultValue: true, description: 'Approval Setting')
        gitParameter branchFilter: 'origin/(.*)', defaultValue: 'dev', name: 'BRANCH', type: 'PT_BRANCH'
    }

    environment {
        AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
    }

    agent any

    stages {
        stage('Lint and Build') {
            sh 'npm install'
            sh 'cd package && npm ci --omit peer'
            sh 'npm run build:dev'
        }
    }
}
