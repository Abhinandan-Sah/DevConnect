// local jenkin run Aws for windows
pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS = credentials('dockerhub-creds')
        GITHUB_CREDENTIALS = credentials('github-creds')
        ENV_FILE = credentials('envfile')
        
        // SSH Configuration
        REMOTE_USER = 'ubuntu'
        REMOTE_HOST = 'ec2-13-235-86-170.ap-south-1.compute.amazonaws.com'
        GIT_REPO = 'https://github.com/Abhinandan-Sah/DevConnect'
        PROJECT_DIR = 'devconnect-deploy'
        
        // Use forward slashes for Git Bash compatibility
        SSH_KEY_PATH = 'C:/Users/abhin/Downloads/devconnect-secret.pem'
        GIT_BASH = 'C:/Git/bin/bash.exe'
    }

    stages {
        stage('Checkout') {
            steps {
                git url: "${env.GIT_REPO}", 
                    branch: 'main',
                    credentialsId: 'github-creds'
            }
        }

        stage('Setup Environment') {
            steps {
                dir('server') {
                    powershell '''
                        $env:ENV_FILE | Out-File -Encoding UTF8 .env
                    '''
                }
            }
        }

        stage('Docker Login') {
            steps {
                bat 'echo %DOCKER_CREDENTIALS_PSW% | docker login -u %DOCKER_CREDENTIALS_USR% --password-stdin'
            }
        }

        stage('Build and Push Images') {
            steps {
                script {
                    // Build and push client
                    dir('client') {
                        bat '''
                            docker build --no-cache --pull -t %DOCKER_CREDENTIALS_USR%/devconnect:client .
                            docker push %DOCKER_CREDENTIALS_USR%/devconnect:client
                        '''
                    }
                    
                    // Build and push server
                    dir('server') {
                        bat '''
                            docker build --no-cache --pull -t %DOCKER_CREDENTIALS_USR%/devconnect:server .
                            docker push %DOCKER_CREDENTIALS_USR%/devconnect:server
                        '''
                    }
                }
            }
        }

        stage('Verify Images') {
            steps {
                bat '''
                    echo Verifying Docker images...
                    docker images | findstr devconnect
                    docker pull %DOCKER_CREDENTIALS_USR%/devconnect:client
                    docker pull %DOCKER_CREDENTIALS_USR%/devconnect:server
                '''
            }
        }

        stage('Deploy to EC2') {
            steps {
                script {
                    // Prepare deployment commands
                    def deployCommands = """
                        rm -rf ${PROJECT_DIR} && \\
                        git clone ${GIT_REPO} ${PROJECT_DIR} && \\
                        cd ${PROJECT_DIR} && \\
                        docker-compose down || true && \\
                        docker-compose pull && \\
                        docker login -u \${DOCKER_CREDENTIALS_USR} -p \${DOCKER_CREDENTIALS_PSW} && \\
                        docker-compose up -d && \\
                        docker logout
                    """.trim()

                    // Execute via Git Bash
                    bat """
                        "${GIT_BASH}" -c "chmod 600 ${SSH_KEY_PATH.replace('\\', '/')} && ssh -o StrictHostKeyChecking=no -i ${SSH_KEY_PATH.replace('\\', '/')} ${REMOTE_USER}@${REMOTE_HOST} '${deployCommands}'"
                    """
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    bat """
                        "${GIT_BASH}" -c "ssh -o StrictHostKeyChecking=no -i ${SSH_KEY_PATH.replace('\\', '/')} ${REMOTE_USER}@${REMOTE_HOST} 'docker ps'"
                    """
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
            echo '✅ Pipeline succeeded! Deployment completed.'
        }
        failure {
            echo '❌ Pipeline failed! Check the logs for errors.'
        }
    }
}






// for Devloyment into ubuntu through AWS
// pipeline {
//     agent any

//     environment {
//         DOCKER_CREDENTIALS = credentials('dockerhub-creds')   // DockerHub credentials
//         GITHUB_CREDENTIALS = credentials('github-creds')      // GitHub credentials
//         ENV_FILE = credentials('envfile')                     // Credentials for .env file
//         EC2_SSH = credentials('ec2-ssh-creds')                // SSH credentials for EC2
//         REMOTE_USER = 'ubuntu'                                // SSH user for Ubuntu EC2
//         REMOTE_HOST = 'ec2-43-204-112-20.ap-south-1.compute.amazonaws.com'  // EC2 Public IP
//         GIT_REPO = 'https://github.com/Abhinandan-Sah/DevConnect'  // GitHub repository URL
//         PROJECT_DIR = 'devconnect-deploy'                     // Directory on EC2 to clone the repo into
//     }

//     stages {
//         stage('Checkout') {
//             steps {
//                 // Checkout code from GitHub
//                 git url: GIT_REPO, branch: 'main', credentialsId: 'github-creds'
//             }
//         }

//         stage('Setup Environment') {
//             steps {
//                 script {
//                     dir('server') {
//                         // Copy .env file in Windows using "bat"
//                         // For Ubuntu EC2, use a Unix-based command like cp instead of bat.
//                         sh 'cp $ENV_FILE .env'
//                     }
//                 }
//             }
//         }

//         stage('Build and Push Docker Images') {
//             steps {
//                 script {
//                     // Docker login to Docker Hub
//                     sh 'echo $DOCKER_CREDENTIALS_PSW | docker login -u $DOCKER_CREDENTIALS_USR --password-stdin'

//                     // Build and Push Client Docker Image to Docker Hub
//                     dir('client') {
//                         sh """
//                             docker build --no-cache=false --pull=true -t $DOCKER_CREDENTIALS_USR/devconnect:client .
//                             docker push $DOCKER_CREDENTIALS_USR/devconnect:client
//                         """
//                     }

//                     // Build and Push Server Docker Image to Docker Hub
//                     dir('server') {
//                         sh """
//                             docker build --no-cache=false --pull=true -t $DOCKER_CREDENTIALS_USR/devconnect:server .
//                             docker push $DOCKER_CREDENTIALS_USR/devconnect:server
//                         """
//                     }
//                 }
//             }
//         }

//         stage('Verify Docker Images') {
//             steps {
//                 script {
//                     sh """
//                         docker images | grep "devconnect"
//                         echo "Verifying images are pushed to Docker Hub..."
//                         docker pull $DOCKER_CREDENTIALS_USR/devconnect:client
//                         docker pull $DOCKER_CREDENTIALS_USR/devconnect:server
//                     """
//                 }
//             }
//         }

//         stage('Deploy to EC2') {
//             steps {
//                 script {
//                     def remoteCommands = """
//                         # Remove any old deployment directory
//                         rm -rf $PROJECT_DIR
//                         # Clone the latest code
//                         git clone $GIT_REPO $PROJECT_DIR
//                         # Navigate to project directory
//                         cd $PROJECT_DIR
//                         # Stop and remove any old containers
//                         docker-compose down || true
//                         # Pull latest Docker images
//                         docker-compose pull
//                         # Build the Docker images
//                         docker-compose build --no-cache
//                         # Start the containers in detached mode
//                         docker-compose up -d
//                     """
                    
//                     // SSH into EC2 instance and execute commands
//                     sshagent (credentials: ['ec2-ssh-creds']) {
//                         sh """
//                         ssh -o StrictHostKeyChecking=no $REMOTE_USER@$REMOTE_HOST '
//                         ${remoteCommands}
//                         '
//                         """
//                     }
//                 }
//             }
//         }

//         stage('Check Running Containers on EC2') {
//             steps {
//                 script {
//                     echo "Checking if the containers are running on EC2..."
//                     // Run docker ps to check container status on EC2
//                     sshagent (credentials: ['ec2-ssh-creds']) {
//                         sh """
//                         ssh -o StrictHostKeyChecking=no $REMOTE_USER@$REMOTE_HOST 'docker ps'
//                         """
//                     }
//                 }
//             }
//         }
//     }

//     post {
//         always {
//             script {
//                 // Cleanup Docker containers if needed
//                 sh 'docker-compose down'
//                 sh 'docker logout'
//                 cleanWs()
//             }
//         }
//         success {
//             echo '✅ Pipeline succeeded! Images have been pushed to Docker Hub and containers deployed on EC2.'
//         }
//         failure {
//             echo '❌ Pipeline failed. Check logs for details.'
//         }
//     }
// }



// This is for window docker localhost of jenkins
// pipeline {
//     agent any

//     environment {
//         DOCKER_CREDENTIALS = credentials('dockerhub-creds')
//         GITHUB_CREDENTIALS = credentials('github-creds')
//         ENV_FILE = credentials('envfile')
//     }

//     stages {
//         stage('Checkout') {
//             steps {
//                 git url: 'https://github.com/Abhinandan-Sah/DevConnect', 
//                     branch: 'main',
//                     credentialsId: 'github-creds'
//             }
//         }

//         stage('Setup Environment') {
//             steps {
//                 script {
//                     dir('server') {
//                         bat 'copy /Y "%ENV_FILE%" .env'
//                     }
//                 }
//             }
//         }

//         stage('Build and Push Images') {
//             steps {
//                 script {
//                     // Docker login
//                     bat 'echo %DOCKER_CREDENTIALS_PSW%| docker login -u %DOCKER_CREDENTIALS_USR% --password-stdin'
                    
//                     // Build & push client
//                     dir('client') {
//                         bat """
//                             docker build --no-cache=false --pull=true -t %DOCKER_CREDENTIALS_USR%/devconnect:client .
//                             docker push %DOCKER_CREDENTIALS_USR%/devconnect:client
//                         """
//                     }
                    
//                     // Build & push server
//                     dir('server') {
//                         bat """
//                             docker build --no-cache=false --pull=true -t %DOCKER_CREDENTIALS_USR%/devconnect:server .
//                             docker push %DOCKER_CREDENTIALS_USR%/devconnect:server
//                         """
//                     }
//                 }
//             }
//         }

//         stage('Verify Images') {
//             steps {
//                 script {
//                     bat """
//                         docker images | findstr "devconnect"
//                         echo "Verifying images are pushed to Docker Hub..."
//                         docker pull %DOCKER_CREDENTIALS_USR%/devconnect:client
//                         docker pull %DOCKER_CREDENTIALS_USR%/devconnect:server
//                     """
//                 }
//             }
//         }

//         stage('Start Containers') {
//             steps {
//                 script {
//                     bat 'docker-compose -f docker-compose.yml up -d'
//                 }
//             }
//         }

//         stage('Check Running Containers') {
//             steps {
//                 bat '''
//                     echo "Checking container status..."
//                     docker ps | findstr "devconnect"
//                     ping -n 11 127.0.0.1 >nul
//                 '''
//             }
//         }
//     }

//     post {
//         always {
//             script {
//                 bat 'docker-compose down'
//                 bat 'docker logout'
//                 cleanWs()
//             }
//         }
//         success {
//             echo '✅ Pipeline succeeded! Images pushed and containers started.'
//         }
//         failure {
//             echo '❌ Pipeline failed. Check logs for details.'
//         }
//     }
// }

// pipeline {
//     agent any

//     environment {
//         DOCKER_CREDENTIALS = credentials('dockerhub-creds')
//         GITHUB_CREDENTIALS = credentials('github-creds')
//         ENV_FILE = credentials('envfile')
//     }

//     stages {
//         stage('Checkout') {
//             steps {
//                 git url: 'https://github.com/Abhinandan-Sah/DevConnect', 
//                     branch: 'main',
//                     credentialsId: 'github-creds'
//             }
//         }

//         stage('Verify Docker Access') {
//             steps {
//                 sh 'docker ps'
//             }
//         }

//         stage('Setup Environment') {
//             steps {
//                 script {
//                     dir('server') {
//                         sh 'cp -f "$ENV_FILE" .env'
//                     }
//                 }
//             }
//         }

//         stage('Build and Push Images') {
//             steps {
//                 script {
//                     // Docker login
//                     sh 'echo "$DOCKER_CREDENTIALS_PSW" | docker login -u "$DOCKER_CREDENTIALS_USR" --password-stdin'
                    
//                     // Build and push client image
//                     dir('client') {
//                         sh '''
//                             docker build --no-cache=false --pull=true -t $DOCKER_CREDENTIALS_USR/devconnect:client .
//                             docker push $DOCKER_CREDENTIALS_USR/devconnect:client
//                         '''
//                     }
                    
//                     // Build and push server image
//                     dir('server') {
//                         sh '''
//                             docker build --no-cache=false --pull=true -t $DOCKER_CREDENTIALS_USR/devconnect:server .
//                             docker push $DOCKER_CREDENTIALS_USR/devconnect:server
//                         '''
//                     }
//                 }
//             }
//         }

//         stage('Verify Images') {
//             steps {
//                 script {
//                     sh '''
//                         docker images | grep "devconnect"
//                         echo "Verifying images are pushed to Docker Hub..."
//                         docker pull $DOCKER_CREDENTIALS_USR/devconnect:client
//                         docker pull $DOCKER_CREDENTIALS_USR/devconnect:server
//                     '''
//                 }
//             }
//         }

        
//     }

//     post {
//         always {
//             script {
//                 sh 'docker logout'
//                 cleanWs()
//             }
//         }
//         success {
//             echo 'Pipeline succeeded! Images have been built, pushed, and deployed to AWS.'
//         }
//         failure {
//             echo 'Pipeline failed! Check the logs for errors.'
//         }
//     }
// }



// This is a Jenkins pipeline script for aws ec2 for building and pushing Docker images for a project.
// pipeline {
//     agent any

//     environment {
//         DOCKER_CREDENTIALS = credentials('dockerhub-creds')
//         GITHUB_CREDENTIALS = credentials('github-creds')
//         ENV_FILE = credentials('envfile')
//         EC2_HOST = 'ubuntu@3.110.135.86'
//         SSH_KEY = credentials('aws-ssh-key')
//     }

//     stages {
//         stage('Checkout') {
//             steps {
//                 git url: 'https://github.com/Abhinandan-Sah/DevConnect', 
//                     branch: 'main',
//                     credentialsId: 'github-creds'
//             }
//         }

//         stage('Setup Environment') {
//             steps {
//                 dir('server') {
//                     sh 'cp -f "$ENV_FILE" .env'
//                 }
//             }
//         }

//         stage('Build and Push Images') {
//             steps {
//                 sh 'echo "$DOCKER_CREDENTIALS_PSW" | docker login -u "$DOCKER_CREDENTIALS_USR" --password-stdin'

//                 dir('client') {
//                     sh '''
//                         docker build --no-cache=false --pull=true -t $DOCKER_CREDENTIALS_USR/devconnect:client .
//                         docker push $DOCKER_CREDENTIALS_USR/devconnect:client
//                     '''
//                 }

//                 dir('server') {
//                     sh '''
//                         docker build --no-cache=false --pull=true -t $DOCKER_CREDENTIALS_USR/devconnect:server .
//                         docker push $DOCKER_CREDENTIALS_USR/devconnect:server
//                     '''
//                 }
//             }
//         }

//         stage('Deploy to AWS') {
//             steps {
//                 sh '''
//                     ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $EC2_HOST "mkdir -p /home/ubuntu/server"
//                     scp -i "$SSH_KEY" -o StrictHostKeyChecking=no docker-compose.yaml $EC2_HOST:/home/ubuntu/
//                     scp -i "$SSH_KEY" -o StrictHostKeyChecking=no server/.env $EC2_HOST:/home/ubuntu/server/
                    
//                     ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $EC2_HOST << EOF
//                     cd /home/ubuntu
//                     docker login -u "$DOCKER_CREDENTIALS_USR" -p "$DOCKER_CREDENTIALS_PSW"
//                     docker-compose pull
//                     docker-compose down || true
//                     docker-compose up -d
//                     docker logout
//                     EOF
//                 '''
//             }
//         }
//     }

//     post {
//         always {
//             sh 'docker logout'
//             cleanWs()
//         }
//         success {
//             echo 'Pipeline succeeded! Images have been built, pushed, and deployed to AWS.'
//         }
//         failure {
//             echo 'Pipeline failed! Check the logs for errors.'
//         }
//     }
// }




// pipeline {
//     agent any

//     environment {
//         DOCKER_CREDENTIALS = credentials('dockerhub-creds')
//         GITHUB_CREDENTIALS = credentials('github-creds')
//         ENV_FILE = credentials('envfile')
//         // EC2 instance details using Ubuntu's default user 'ubuntu' if applicable; adjust if needed.
//         // If your instance is still Amazon Linux then 'ec2-user' may be valid.
//         EC2_HOST = 'ubuntu@13.235.71.230'  
//         SSH_KEY = credentials('aws-ssh-key')
//     }

//     stages {
//         stage('Checkout') {
//             steps {
//                 git url: 'https://github.com/Abhinandan-Sah/DevConnect',
//                     branch: 'main',
//                     credentialsId: 'github-creds'
//             }
//         }

//         stage('Setup Environment') {
//             steps {
//                 script {
//                     dir('server') {
//                         // On Ubuntu, use 'cp' instead of Windows copy command.
//                         sh 'cp -f "$ENV_FILE" .env'
//                     }
//                 }
//             }
//         }

//         stage('Build and Push Images') {
//             steps {
//                 script {
//                     // Docker login via shell command.
//                     sh 'echo "$DOCKER_CREDENTIALS_PSW" | docker login -u "$DOCKER_CREDENTIALS_USR" --password-stdin'
                    
//                     // Build and push client image.
//                     dir('client') {
//                         sh '''
//                             docker build --no-cache=false --pull=true -t $DOCKER_CREDENTIALS_USR/devconnect:client .
//                             docker push $DOCKER_CREDENTIALS_USR/devconnect:client
//                         '''
//                     }
                    
//                     // Build and push server image.
//                     dir('server') {
//                         sh '''
//                             docker build --no-cache=false --pull=true -t $DOCKER_CREDENTIALS_USR/devconnect:server .
//                             docker push $DOCKER_CREDENTIALS_USR/devconnect:server
//                         '''
//                     }
//                 }
//             }
//         }

//         stage('Verify Images') {
//             steps {
//                 script {
//                     sh '''
//                         docker images | grep "devconnect"
//                         echo "Verifying images are pushed to Docker Hub..."
//                         docker pull $DOCKER_CREDENTIALS_USR/devconnect:client
//                         docker pull $DOCKER_CREDENTIALS_USR/devconnect:server
//                     '''
//                 }
//             }
//         }
        
//         stage('Deploy to AWS') {
//             steps {
//                 script {
//                     // Copy docker-compose file and .env (for server) to the EC2 instance.
//                     sh '''
//                         scp -i "$SSH_KEY" -o StrictHostKeyChecking=no docker-compose.yaml $EC2_HOST:/home/ubuntu/
//                         scp -i "$SSH_KEY" -o StrictHostKeyChecking=no server/.env $EC2_HOST:/home/ubuntu/server/
//                     '''
                    
//                     // SSH into the EC2 instance and deploy via Docker Compose.
//                     sh '''
//                         ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $EC2_HOST "cd /home/ubuntu && docker login -u $DOCKER_CREDENTIALS_USR -p $DOCKER_CREDENTIALS_PSW && docker-compose pull && docker-compose down || true && docker-compose up -d && docker logout"
//                     '''
//                 }
//             }
//         }
//     }

//     post {
//         always {
//             script {
//                 sh 'docker logout'
//                 cleanWs()
//             }
//         }
//         success {
//             echo 'Pipeline succeeded! Images have been built, pushed, and deployed to AWS.'
//         }
//         failure {
//             echo 'Pipeline failed! Check the logs for errors.'
//         }
//     }
// }

// This is for window docker localhost of jenkins
// pipeline {
//     agent any

//     environment {
//         DOCKER_CREDENTIALS = credentials('dockerhub-creds')
//         GITHUB_CREDENTIALS = credentials('github-creds')
//         ENV_FILE = credentials('envfile')
//     }

//     stages {
//         stage('Checkout') {
//             steps {
//                 git url: 'https://github.com/Abhinandan-Sah/DevConnect', 
//                     branch: 'main',
//                     credentialsId: 'github-creds'
//             }
//         }

//         stage('Setup Environment') {
//             steps {
//                 script {
//                     dir('server') {
//                         bat 'copy /Y "%ENV_FILE%" .env'
//                     }
//                 }
//             }
//         }

//         stage('Build and Push Images') {
//             steps {
//                 script {
//                     // Simplified Docker login
//                     bat 'echo %DOCKER_CREDENTIALS_PSW%| docker login -u %DOCKER_CREDENTIALS_USR% --password-stdin'
                    
//                     // Build and push client image
//                     dir('client') {
//                         bat """
//                             docker build --no-cache=false --pull=true -t %DOCKER_CREDENTIALS_USR%/devconnect:client .
//                             docker push %DOCKER_CREDENTIALS_USR%/devconnect:client
//                         """
//                     }
                    
//                     // Build and push server image
//                     dir('server') {
//                         bat """
//                             docker build --no-cache=false --pull=true -t %DOCKER_CREDENTIALS_USR%/devconnect:server .
//                             docker push %DOCKER_CREDENTIALS_USR%/devconnect:server
//                         """
//                     }
//                 }
//             }
//         }

//         stage('Verify Images') {
//             steps {
//                 script {
//                     bat """
//                         docker images | findstr "devconnect"
//                         echo "Verifying images are pushed to Docker Hub..."
//                         docker pull %DOCKER_CREDENTIALS_USR%/devconnect:client
//                         docker pull %DOCKER_CREDENTIALS_USR%/devconnect:server
//                     """
//                 }
//             }
//         }
//     }

//     post {
//         always {
//             script {
//                 bat 'docker logout'
//                 cleanWs()
//             }
//         }
//         success {
//             echo 'Pipeline succeeded! Images have been built and pushed to Docker Hub.'
//         }
//         failure {
//             echo 'Pipeline failed! Check the logs for errors.'
//         }
//     }
// }

// pipeline {
//     agent any

//     environment {
//         DOCKER_CREDENTIALS = credentials('dockerhub-creds')
//         GITHUB_CREDENTIALS = credentials('github-creds')
//         ENV_FILE = credentials('envfile')
//     }

//     stages {
//         stage('Checkout') {
//             steps {
//                 git url: 'https://github.com/Abhinandan-Sah/DevConnect', 
//                     branch: 'main',
//                     credentialsId: 'github-creds'
//             }
//         }

//         stage('Setup Environment') {
//             steps {
//                 script {
//                     dir('server') {
//                         bat 'copy /Y "%ENV_FILE%" .env'
//                     }
//                 }
//             }
//         }

//         stage('Build and Push Client Image') {
//             when {
//                 changeset "**/client/**"
//             }
//             steps {
//                 script {
//                     // Docker login
//                     bat 'echo %DOCKER_CREDENTIALS_PSW%| docker login -u %DOCKER_CREDENTIALS_USR% --password-stdin'
                    
//                     // Build and push client image
//                     dir('client') {
//                         bat """
//                             docker build --no-cache=false --pull=true -t %DOCKER_CREDENTIALS_USR%/devconnect:client .
//                             docker push %DOCKER_CREDENTIALS_USR%/devconnect:client
//                         """
//                     }
//                 }
//             }
//         }

//         stage('Build and Push Server Image') {
//             when {
//                 changeset "**/server/**"
//             }
//             steps {
//                 script {
//                     // Docker login (login happens here too if not already logged in)
//                     bat 'echo %DOCKER_CREDENTIALS_PSW%| docker login -u %DOCKER_CREDENTIALS_USR% --password-stdin'
                    
//                     // Build and push server image using the optimized Dockerfile
//                     dir('server') {
//                         bat """
//                             docker build --no-cache=false --pull=true -t %DOCKER_CREDENTIALS_USR%/devconnect:server .
//                             docker push %DOCKER_CREDENTIALS_USR%/devconnect:server
//                         """
//                     }
//                 }
//             }
//         }

//         stage('Verify Images') {
//             steps {
//                 script {
//                     bat """
//                         docker images | findstr "devconnect"
//                         echo "Verifying images are pushed to Docker Hub..."
//                         docker pull %DOCKER_CREDENTIALS_USR%/devconnect:client
//                         docker pull %DOCKER_CREDENTIALS_USR%/devconnect:server
//                     """
//                 }
//             }
//         }
//     }

//     post {
//         always {
//             script {
//                 bat 'docker logout'
//                 cleanWs()
//             }
//         }
//         success {
//             echo 'Pipeline succeeded! Images have been built and pushed to Docker Hub.'
//         }
//         failure {
//             echo 'Pipeline failed! Check the logs for errors.'
//         }
//     }
// }