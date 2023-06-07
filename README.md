# IIIF for the Open Data Portal of the City of Leipzig

Get all packages (collection level)
https://opendata.leipzig.de/api/3/action/package_list

Get a specific package (manifest level)
https://opendata.leipzig.de/api/3/action/package_show?id=volkerschlachtdenkmal-ansicht-vom-sudfriedhof-im-winter-nach-1913

Get a resource (image level)
https://opendata.leipzig.de/api/3/action/resource_show?id=b28b38fa-85e5-4a8b-98a0-5230cd3f275c


## URI Schema

This is an intermediate URI schema that may or should be subject to change in the future.

### Presentation API

Collection: leipzig.iiif.cloud/manifest/<package_id>

Manifest: leipzig.iiif.cloud/manifest/<package_id>

Canvas: leipzig.iiif.cloud/manifest/<package_id>/canvas<number>

### Image API

Images: leipzig.iiif.cloud/image/<resource_id>
