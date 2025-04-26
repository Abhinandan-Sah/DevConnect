pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS = credentials('dockerhub-creds')
        GITHUB_CREDENTIALS = credentials('github-creds')
        ENV_FILE = credentials('envfile')
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/Abhinandan-Sah/DevConnect', 
                    branch: 'main',
                    credentialsId: 'github-creds'
            }
        }

        stage('Setup Environment') {
            steps {
                script {
                    dir('server') {
                        bat 'copy /Y "%ENV_FILE%" .env'
                    }
                }
            }
        }

        stage('Build and Push Images') {
    steps {
        script {
            // Docker login
            powershell '''
                $password = $env:DOCKER_CREDENTIALS_PSW | ConvertTo-SecureString -AsPlainText -Force
                $credential = New-Object System.Management.Automation.PSCredential($env:DOCKER_CREDENTIALS_USR, $password)
                $credential.GetNetworkCredential().Password | docker login -u $env:DOCKER_CREDENTIALS_USR --password-stdin
            '''
            
            // Build and push client image
            dir('client') {
                bat """
                    cd %WORKSPACE%\\client
                    docker build -t %DOCKER_CREDENTIALS_USR%/devconnect:client ./client
                    docker push %DOCKER_CREDENTIALS_USR%/devconnect:client
                """
            }
            
            // Build and push server image
            dir('server') {
                bat """
                    cd %WORKSPACE%\\server
                    docker build -t %DOCKER_CREDENTIALS_USR%/devconnect:server ./server
                    docker push %DOCKER_CREDENTIALS_USR%/devconnect:server
                """
            }
        }
    }
}
        stage('Verify Images') {
            steps {
                script {
                    bat """
                        docker images | findstr "devconnect"
                        echo "Verifying images are pushed to Docker Hub..."
                        docker pull %DOCKER_CREDENTIALS_USR%/devconnect:client
                        docker pull %DOCKER_CREDENTIALS_USR%/devconnect:server
                    """
                }
            }
        }
    }

    post {
        always {
            script {
                bat 'docker logout'
                cleanWs()
            }
        }
        success {
            echo 'Pipeline succeeded! Images have been built and pushed to Docker Hub.'
        }
        failure {
            echo 'Pipeline failed! Check the logs for errors.'
        }
    }
}