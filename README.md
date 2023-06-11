# IIIF for the Open-Data-Portal of the City of Leipzig

This is an external IIIF API service for the CKAN Open Data Portal of the City of Leipzig. It is my entry to the Open Data Hackathon 2023 of the City of Leipzig (https://2023.dataweek.de/lodh-2023/).

<img src="img/iiif-leipzig-social.png" heigh="400" />

Technical Features:
* Supports IIIF Presentation API version 2.1.1 and 3.0.0
* Supports IIIF Image API version 2 and 3 (via IIPImage Server)
* Cache with seamless demand driven metadata updates
* Lossless quality image conversion
* Asychronous/parallel architecture: high responsiveness even under high image conversion load
* Content Negotiation

Endless IIIF usage scenarios
* Digital Storytelling
* Cross-Institutional Research Workspaces
* Create Annotations
* Games and Fun-Apps
* Well prepared for AI and Machine-Learning
* and many more

## Data Modelling

The current mapping is as follows

| CKAN | IIIF |
| ---- | ---- |
| dataset | manifest |
| resource | canvas / annotation page / image |

Important calls:

Get all (max. 1000) datasets with resource format "jpg":
https://opendata.leipzig.de/api/3/action/dataset_search?fq=res_format:jpg&rows=1000

Get a specific dataset:
https://opendata.leipzig.de/api/3/action/dataset_show?id=d52bbf61-1995-4c41-a819-885fc4ea175a

Get a resource (canvas/image level):
https://opendata.leipzig.de/api/3/action/resource_show?id=b28b38fa-85e5-4a8b-98a0-5230cd3f275c

### IIIF URI Schema

This is an intermediate URI schema that may or should be subject to change in the future.

#### Presentation API

Manifest:

```https://leipzig.iiif.cloud/manifest/<dataset.id>```

Canvas:

```https://leipzig.iiif.cloud/manifest/<dataset.id>/canvas/<resource.id>```

#### Image API

```https://leipzig.iiif.cloud/image/<resource_id>```

## Notes

ImageMagick required this in ```/etc/ImageMagick-6/policy.xml``` in order to process large images:
```
<policy domain="resource" name="disk" value="8GB"/>
```

## Installation

* check out this repository

* run ```npm install```

* copy ```src/config.example.json``` to ```src/config.json``` and edit all parameters

* run ```nodemon src/index.js```

* optional: edit and run ```node src/utils/warmup.js``` in order to do all the heavy image conversion upfront
