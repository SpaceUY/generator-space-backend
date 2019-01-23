import { SchemaOptions } from 'mongoose';

<%- imports %>

const schema: { schemaOptions: SchemaOptions } = { schemaOptions: { timestamps: true } };

// tslint:disable:variable-name
<%- models %>
