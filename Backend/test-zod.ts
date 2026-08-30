import { z, ZodError } from 'zod';

const schema = z.object({ name: z.string() });
try {
  schema.parse({});
} catch (e) {
  if (e instanceof ZodError) {
    console.log("has errors:", !!(e as any).errors);
    console.log("has issues:", !!(e as any).issues);
    console.log(e.errors);
  }
}
