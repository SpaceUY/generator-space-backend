<%- imports %>

import routes from './routes';<%- graphImport %>
<%- mongooseBody %><%- passport %>
const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  }),
);
app.use(bodyparser.json({ limit: '1mb' }));

app.use(routes);
<%- appUseGraph %>
app.listen(process.env.PORT, () => {
  console.log('Express Ready');
});
