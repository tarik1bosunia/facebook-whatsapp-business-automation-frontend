```plaintext
src/
├── lib/
│   └── redux/
│       ├── api/
│       │   ├── baseQuery.ts              # Base query configuration
│       │   ├── baseQueryWithReauth.ts    # Your auth interceptor
│       │   ├── apiSlice.ts               # Root API slice
│       │   └── errorHandler.ts           # API error handling
│       │
│       ├── features/                     # Feature-specific API endpoints
│       │   ├── auth/
│       │   │   ├── authApi.ts            # Auth endpoints
│       │   │   └── authApi.types.ts      # Auth endpoint types
│       │   ├── user/
│       │   │   ├── userApi.ts            # User endpoints
│       │   │   └── userApi.types.ts      # User endpoint types
│       │   └── ...                       # Other feature APIs
│       │
│       ├── slices/                       # Redux slices
│       │   ├── authSlice.ts
│       │   ├── userSlice.ts
│       │   └── ...
│       │
│       ├── hooks/                        # Custom Redux hooks
│       │   ├── useTypedSelector.ts
│       │   └── useTypedDispatch.ts
│       │
│       └── store.ts                      # Redux store configuration
└── ...
```