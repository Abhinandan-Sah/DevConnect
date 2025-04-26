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
                    credentialsId: 'github-creds'
            }
        }

        stage('Setup Environment') {
            steps {
                script {
                    // Create .env file for server
                    dir('server') {
                        bat """
                            echo DB_URL=%MONGODB_URI% > .env
                            echo JWT_SECRET_KEY=%JWT_SECRET% >> .env
                            echo PORT=5000 >> .env
                        """
                    }
                }
            }
        }

        stage('Build and Push Images') {
            steps {
                script {
                    bat 'echo %DOCKER_CREDENTIALS_PSW% | docker login -u %DOCKER_CREDENTIALS_USR% --password-stdin'
                    
                    // Build and push images
                    dir('client') {
                        bat "docker build -t %DOCKER_CREDENTIALS_USR%/devconnect:client ."
                        bat "docker push %DOCKER_CREDENTIALS_USR%/devconnect:client"
                    }
                    
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
    }
}