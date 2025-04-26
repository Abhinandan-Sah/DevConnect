// pipeline {
// agent any

// environment {
//     GITHUB_TOKEN = credentials('github-token')
// }

// stages {
//     stage('Checkout') {
//         steps {
//             git url: 'https://github.com/Abhinandan-Sah/DevConnect', credentialsId: 'github-token'
//         }
//     }

//     stage('Build Docker Image') {
//         steps {
//             script {
//                 sh 'docker build -t DevConnect .'
//             }
//         }
//     }

//     stage('Run Docker Image') {
//         steps {
//             script {
//                 sh 'docker run -d -p 8085:8080 DevConnect'
//             }
//         }
//     }
// }

// post {
//     success {
//         echo 'Build and deployment succeeded!'
//     }
//     failure {
//         echo 'Build or deployment failed!'
//     }
// }
// }


pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS = credentials('dockerhub-creds')
        GITHUB_CREDENTIALS = credentials('github-creds')
        DB_URL = credentials('DB_URL')
        JWT_SECRET_KEY = credentials('JWT_SECRET_KEY')
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
                        powershell '''
                            Set-Content -Path .env -Value "DB_URL=$env:DB_URL"
                            Add-Content -Path .env -Value "JWT_SECRET_KEY=$env:JWT_SECRET_KEY"
                            Add-Content -Path .env -Value "PORT=5000"
                        '''
                    }
                }
            }
        }

        stage('Build and Push Images') {
            steps {
                script {
                    // Docker login
                    powershell 'docker login -u $env:DOCKER_CREDENTIALS_USR -p $env:DOCKER_CREDENTIALS_PSW'

                    
                    // Build and push client image
                    dir('client') {
                        bat "docker build -t %DOCKER_CREDENTIALS_USR%/devconnect:client ."
                        bat "docker push %DOCKER_CREDENTIALS_USR%/devconnect:client"
                    }
                    
                    // Build and push server image
                    dir('server') {
                        bat "docker build -t %DOCKER_CREDENTIALS_USR%/devconnect:server ."
                        bat "docker push %DOCKER_CREDENTIALS_USR%/devconnect:server"
                    }
                }
            }
        }
    }

    post {
        always {
            bat 'docker logout'
            cleanWs()
        }
        success {
            echo 'Pipeline succeeded! Images have been built and pushed.'
        }
        failure {
            echo 'Pipeline failed! Check the logs for errors.'
        }
    }
}
