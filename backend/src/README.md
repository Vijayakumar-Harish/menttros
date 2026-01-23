# Backend Structure

This backend follows a domain-driven, modular monolith architecture.

## Layers

- domain: core business entities and rules
- app: application services and modules
- infrastructure: database, server, external integrations

Business logic must live in the domain layer.
Framework-specific code must stay in infrastructure.
