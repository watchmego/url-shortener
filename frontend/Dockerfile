FROM public.ecr.aws/bitnami/node:14-prod-debian-10


# Create app directory
WORKDIR usr/src/app


COPY . .

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["/bin/bash", "-l", "-c"]
CMD [ "/bin/bash", "node", "server.js"]
