# Skill: Add New API Call

Use this skill when wiring a new backend endpoint into a component.

## Steps

1. **Register the endpoint path** in `src/config.js`
   - Public endpoint → add to `config.apiEndpoints.general`
   - Authenticated endpoint → add to `config.apiEndpoints.auth`

2. **Add a service method** in `src/services/api.js`

   ```js
   async fetchResource() {
     return this.getData(config.apiEndpoints.auth.resource);
   }

   async createResource(data) {
     return this.postData(config.apiEndpoints.auth.resource, data);
   }

   async updateResource(id, data) {
     return this.putData(config.apiEndpoints.auth.resource, id, data);
   }

   async deleteResource(id) {
     return this.deleteData(config.apiEndpoints.auth.resource, id);
   }
   ```

3. **Call it in the component via `useApi`**

   ```jsx
   const { callApi, loading, error } = useApi();
   const [data, setData] = useState(null);

   useEffect(() => {
     callApi(apiService.fetchResource.bind(apiService))
       .then(result => setData(result))
       .catch(() => {});
   }, []);
   ```

4. **Render feedback states**
   ```jsx
   if (loading) return <Loader />;
   if (error) return <NotificationToast message={error} />;
   ```

## Checklist
- [ ] Endpoint path added to `src/config.js`
- [ ] Service method uses the correct base method (`getData`, `postData`, etc.)
- [ ] Component uses `useApi` — no manual `loading` state
- [ ] Loading and error states render appropriate components
- [ ] On 401 catch: clear tokens and navigate to `/sign-in` if required
