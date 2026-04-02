import { supabase, supabaseAdmin } from '../../config/supabase';
import { prisma } from '../../config/database';
import { generateSlug } from '../../utils/slug';
import { ApiError } from '../../utils/errors';
import type { RegisterInput, LoginInput } from './validators';

export async function register(input: RegisterInput) {
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
    });

  if (authError) throw new ApiError(400, authError.message);

  let slug = generateSlug(input.restaurantName);

  const existing = await prisma.restaurant.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  try {
    const user = await prisma.user.create({
      data: {
        email: input.email,
        supabaseId: authData.user.id,
        role: 'OWNER',
        restaurant: {
          create: {
            slug,
            name: input.restaurantName,
            whatsapp: input.whatsapp,
            address: input.address,
            category: input.category,
            status: 'PENDING',
          },
        },
      },
      include: { restaurant: true },
    });

    const { data: session } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    return { user, token: session.session?.access_token };
  } catch (err) {
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    throw err;
  }
}

export async function login(input: LoginInput) {
  const { data: session, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) throw new ApiError(401, 'Email o contraseña incorrectos');

  const user = await prisma.user.findUnique({
    where: { email: input.email },
    include: { restaurant: true },
  });

  if (!user) throw new ApiError(404, 'Usuario no encontrado');

  return { user, token: session.session?.access_token };
}
