# IIIF for the Open Data Portal of the City of Leipzig

## Data Model

For now the mapping is as follows

| CKAN | IIIF |
| ---- | ---- |
| dataset | manifest |
| resource | canvas/image |

Import calls:

Get all (max. 1000) datasets with resource format "jpg":
https://opendata.leipzig.de/api/3/action/dataset_search?fq=res_format:jpg&rows=1000

Get a specific dataset:
https://opendata.leipzig.de/api/3/action/dataset_show?id=d52bbf61-1995-4c41-a819-885fc4ea175a

Get a resource (canvas/image level):
https://opendata.leipzig.de/api/3/action/resource_show?id=b28b38fa-85e5-4a8b-98a0-5230cd3f275c

## IIIF URI Schema

This is an intermediate URI schema that may or should be subject to change in the future.

### Presentation API

Manifest:

```https://leipzig.iiif.cloud/manifest/<dataset.id>```

Canvas:

```https://leipzig.iiif.cloud/manifest/<dataset.id>/canvas/<resource.id>```

### Image API

Images: leipzig.iiif.cloud/image/<resource_id>
