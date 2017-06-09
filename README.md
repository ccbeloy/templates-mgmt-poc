# Template Management REST Api
This is a sample rest api for content template management.
This service uses a JSON file for its persistence for simplicity.

## Setup Instructions
1. Install Node.js https://nodejs.org
2. Run `npm install` on project root directory
3. Service url will be http://localhost:9200/templates
4. To run unit tests, `npm test` on project root directory

## Supported REST APIs
### GET /templates
This will returns all templates stored on its local persistence (json file).

### GET /templates/:id
This will return a single template with the specified Id.
Also supports passing replacement variables on the query string.
Example: http://localhost:9200/templates/123_en-us?name=calvin

### POST /templates
Post body: 
`{
    "contentId":456,
    "localeCode":"en-us",
    "content":"Sample content"
}`

Adds a new template to its local storage

## Limitations
This sample service does not use a centralize persistent store. Only uses JSON file which is local to the service instance.
So running multiple instances of the service on different hosts or root locations will not share the same storage.