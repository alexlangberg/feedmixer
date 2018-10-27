########## feedmixer ##########

FROM nginx:1.15.5

COPY dist/feedmixer/ /usr/share/nginx/html
