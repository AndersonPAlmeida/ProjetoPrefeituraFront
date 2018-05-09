FROM node:8.9.4
LABEL maintainer="horstmannmat <mch15@inf.ufpr.br>"

ENV DEBIAN_FRONTEND noninteractive
ENV LANG C.UTF-8

#Install apt-utils to prevent warning messages
RUN apt-get -y update -qq && apt-get install -y -qq apt-utils

# Set an environment variable to store where the app is installed to inside of the Docker image.
ENV INSTALL_PATH /app
RUN mkdir -p $INSTALL_PATH

# This sets the context of where commands will be ran in and is documented
# on Docker's website extensively.

WORKDIR $INSTALL_PATH


COPY . .


RUN npm install npm@latest -g && \
         npm install

# VOLUME ["$INSTALL_PATH/src"]

EXPOSE 3002
EXPOSE 3001

ENTRYPOINT ["/app/agendador-entrypoint.sh"]
CMD ["DEVELOPMENT"]
