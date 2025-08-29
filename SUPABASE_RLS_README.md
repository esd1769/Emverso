# Supabase Row Level Security (RLS) Implementation

## Problem
Currently, the application has a security vulnerability where any user can delete any companion record from the Supabase database if they bypass the frontend UI restrictions. While the frontend only shows the delete button to the author of a companion, and the server-side function includes an author check, there's no database-level protection preventing unauthorized deletions.

## Solution
Implement Row Level Security (RLS) policies in Supabase to ensure that only the creator of a record can delete it, regardless of how the request is made.

## Implementation Steps

1. Log in to your Supabase dashboard at https://app.supabase.com/
2. Navigate to your project
3. Go to the SQL Editor
4. Copy and paste the contents of the `supabase_rls_policy.sql` file
5. Execute the SQL commands

## What the RLS Policies Do

- **Delete Policy**: Ensures only the author can delete their own companions
- **Update Policy**: Ensures only the author can update their own companions
- **Insert Policy**: Ensures users can only create companions with their own user ID
- **Select Policy**: Allows anyone to view companions

## Verification

After implementing these policies, you can verify they're working by:

1. Trying to delete a companion that you didn't create through the Supabase dashboard or API
2. Confirming that the operation fails with a permission error

## Current Implementation

The current implementation in `companion.actions.ts` already includes an author check:

```typescript
export const deleteCompanion = async (companionId: string) => {
    const { userId } = await auth();
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from('companions')
        .delete()
        .eq('id', companionId)
        .eq('author', userId);  // This line restricts deletion to the author

    if (error) throw new Error(error.message);

    return data;
}
```

However, this is only enforced at the application level. The RLS policies add an additional layer of security at the database level, ensuring that even if someone bypasses the application logic, they still cannot delete records they don't own.

## Important Notes

- RLS policies are enforced for all queries made with the anon key or authenticated users
- Service keys bypass RLS, so be careful when using them
- These policies protect your data even when accessed through third-party tools or direct database access