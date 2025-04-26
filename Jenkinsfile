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
        MONGODB_URI = credentials('mongodb-uri')
        JWT_SECRET = credentials('jwt-secret')
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
                    // Create .env file for server
                    dir('server') {
                        powershell '''
                            Set-Content -Path .env -Value "DB_URL=$env:MONGODB_URI"
                            Add-Content -Path .env -Value "JWT_SECRET_KEY=$env:JWT_SECRET"
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
                    powershell 'echo $env:DOCKER_CREDENTIALS_PSW | docker login -u $env:DOCKER_CREDENTIALS_USR --password-stdin'
                    
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
