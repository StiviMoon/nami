'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Clock, MapPin, Instagram, Facebook } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatTodayHoursLabel, isOpenNow, type WeekSchedule } from '@/lib/uix-schedule';
import { CartModal, CartFloatingBarUix } from '@/components/uix/CartModal';
import { CategoryTabs } from '@/components/web/CategoryTabs';
import { RestaurantMenuItemRow, type PublicMenuItem } from '@/components/web/RestaurantMenuItemRow';
import { ClosedStoreModal } from '@/components/web/ClosedStoreModal';
import { FavoriteButton } from '@/components/web/FavoriteButton';
import { ShareButton } from '@/components/web/ShareButton';
import { normalizeMenuCustomization, buildCartLineId, type MenuExtra } from '@/lib/menu-customization';
import { CustomizationModal } from '@/components/uix/CustomizationModal';
import {
  getCustomThemeStyle,
  getMenuCardStyleClasses,
  getThemeClasses,
} from '@/lib/restaurant-theme';
import { cn } from '@/lib/utils';
import { parseDeliveryZones } from '@/lib/delivery-zones';

const GOOGLE_FONT_NAMES = new Set([
  'Inter',
  'Poppins',
  'Playfair Display',
  'Montserrat',
  'Nunito',
  'Raleway',
  'Lora',
]);

const ALL_CATEGORY_ID = '__all__';

type MenuCategory = {
  id: string;
  name: string;
  items: Array<{
    id: string;
    name: string;
    description?: string | null;
    price: string | number;
    imageUrl?: string | null;
    badge?: string | null;
    isAvailable: boolean;
    customization?: unknown;
  }>;
};

type Restaurant = {
  id: string;
  name: string;
  address?: string | null;
  description?: string | null;
  bannerText?: string | null;
  coverUrl?: string | null;
  isClosed: boolean;
  whatsapp?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  facebook?: string | null;
  /** Branding (perfil → se aplica en esta página) */
  themePreset?: string | null;
  menuStyle?: string | null;
  fontFamily?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  menuLayout?: string | null;
  deliveryZones?: unknown;
};

type Props = {
  restaurant: Restaurant;
  categories: MenuCategory[];
  slug: string;
  schedule: WeekSchedule | null;
};

export function RestaurantMenuUix({ restaurant, categories, slug, schedule }: Props) {
  const cart = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORY_ID);
  const [closedModalOpen, setClosedModalOpen] = useState(false);
  const [customItem, setCustomItem] = useState<{
    id: string;
    name: string;
    description?: string | null;
    price: number;
    extras?: MenuExtra[];
    removables?: string[];
  } | null>(null);
  const open = isOpenNow(schedule, restaurant.isClosed);

  useEffect(() => {
    if (restaurant.isClosed) setClosedModalOpen(true);
  }, [restaurant.isClosed]);

  useEffect(() => {
    setActiveCategory(ALL_CATEGORY_ID);
  }, [categories]);

  const theme = useMemo(() => getThemeClasses(restaurant.themePreset ?? undefined), [restaurant.themePreset]);
  const itemCardClass = useMemo(
    () => getMenuCardStyleClasses(restaurant.menuStyle ?? undefined),
    [restaurant.menuStyle]
  );
  const customVars = useMemo(() => getCustomThemeStyle(restaurant), [restaurant]);
  const isGrid = restaurant.menuLayout === 'grid';
  const deliveryZones = useMemo(
    () => parseDeliveryZones(restaurant.deliveryZones),
    [restaurant.deliveryZones]
  );

  const fontFamilyStyle = restaurant.fontFamily?.trim()
    ? { fontFamily: `"${restaurant.fontFamily.trim()}", system-ui, sans-serif` }
    : {};

  useEffect(() => {
    const name = restaurant.fontFamily?.trim();
    if (!name || !GOOGLE_FONT_NAMES.has(name)) return;
    const id = `ñami-font-${name.replace(/\s+/g, '-')}`;
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name)}:wght@400;600;700;800&display=swap`;
    document.head.appendChild(link);
  }, [restaurant.fontFamily]);

  const addSimple = (item: { id: string; name: string; price: string | number }) => {
    const lineId = buildCartLineId(item.id, [], []);
    cart.addItem(
      {
        lineId,
        id: item.id,
        restaurantId: restaurant.id,
        name: item.name,
        price: Number(item.price),
      },
      restaurant.name,
      restaurant.whatsapp || ''
    );
  };

  const handleAddClick = (item: PublicMenuItem) => {
    if (!item.isAvailable) return;
    const normalized = normalizeMenuCustomization(item.customization);
    if (
      normalized &&
      ((normalized.extras?.length ?? 0) > 0 || (normalized.removables?.length ?? 0) > 0)
    ) {
      setCustomItem({
        id: item.id,
        name: item.name,
        description: item.description,
        price: Number(item.price),
        extras: normalized.extras,
        removables: normalized.removables,
      });
    } else {
      addSimple(item);
    }
  };

  const totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  const todayHours = formatTodayHoursLabel(schedule);
  const activeItems =
    activeCategory === ALL_CATEGORY_ID
      ? []
      : categories.find((c) => c.id === activeCategory)?.items ?? [];

  const activeCategoryName =
    activeCategory === ALL_CATEGORY_ID
      ? 'Todo el menú'
      : categories.find((c) => c.id === activeCategory)?.name ?? 'Menú';

  const tabCategories = useMemo(
    () => [
      { id: ALL_CATEGORY_ID, name: 'Todo' },
      ...categories.map((c) => ({ id: c.id, name: c.name })),
    ],
    [categories]
  );

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `/${slug}`;

  const tagLabels = categories.map((c) => c.name).filter(Boolean).slice(0, 6);

  const itemsLayoutClass = isGrid ? 'grid grid-cols-1 gap-4 sm:grid-cols-2' : 'flex flex-col gap-4';

  return (
    <div
      className="min-h-dvh bg-gray-50 pb-28 font-sans antialiased"
      style={{ ...customVars, ...fontFamilyStyle }}
    >
      <ClosedStoreModal
        isOpen={closedModalOpen}
        onClose={() => setClosedModalOpen(false)}
        restaurantName={restaurant.name}
        schedule={schedule ?? undefined}
      />

      {/* Hero */}
      <div className="relative h-64 w-full bg-gray-200 sm:h-80">
        {restaurant.coverUrl ? (
          <img
            src={restaurant.coverUrl}
            alt=""
            className={`h-full w-full object-cover ${!open ? 'grayscale' : ''}`}
          />
        ) : (
          <div
            className={cn(
              'flex h-full w-full items-center justify-center bg-linear-to-br text-6xl opacity-40',
              theme.header
            )}
          >
            🍽
          </div>
        )}
        <div
          className={cn('pointer-events-none absolute inset-0 bg-linear-to-br opacity-35', theme.header)}
          aria-hidden
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/60" />

        <div
          className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between p-4"
          style={{ paddingTop: 'max(1rem, var(--safe-top))' }}
        >
          <Link
            href="/feed"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-sm backdrop-blur-md transition-colors hover:bg-white"
            aria-label="Volver al feed"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex gap-2">
            <ShareButton
              url={shareUrl}
              title={restaurant.name}
              text={`Mira ${restaurant.name} en ÑAMI`}
              className="flex h-10 w-10 shrink-0 items-center justify-center text-gray-800"
            />
            <FavoriteButton
              restaurantId={restaurant.id}
              size="md"
              className="flex h-10 w-10 shrink-0 items-center justify-center shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Tarjeta info */}
        <div className="relative z-10 -mt-10 rounded-t-[2.5rem] border border-gray-100 bg-white px-6 pb-6 pt-8 shadow-sm sm:-mt-16 sm:rounded-3xl">
          <h1 className="mb-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">{restaurant.name}</h1>

          {restaurant.bannerText?.trim() && (
            <p className="mb-3 text-sm italic text-gray-500">&ldquo;{restaurant.bannerText.trim()}&rdquo;</p>
          )}

          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <div
              className={`flex items-center gap-1 rounded-lg px-2 py-1 font-bold ${
                open ? 'bg-green-50 text-green-700' : 'bg-rose-50 text-rose-700'
              }`}
            >
              <span
                className={`relative inline-flex h-2.5 w-2.5 rounded-full ${open ? 'bg-green-500' : 'bg-rose-500'}`}
              />
              <span>{open ? 'Abierto' : 'Cerrado'}</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1">
              <Clock size={14} className="text-gray-500" />
              <span>{todayHours}</span>
            </div>
            {restaurant.address && (
              <>
                <span className="text-gray-300">•</span>
                <div className="flex min-w-0 items-start gap-1 text-gray-600">
                  <MapPin size={14} className={cn('mt-0.5 shrink-0', theme.accent)} />
                  <span className="line-clamp-2">{restaurant.address}</span>
                </div>
              </>
            )}
          </div>

          {tagLabels.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {tagLabels.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {restaurant.description?.trim() && (
            <p className="text-sm leading-relaxed text-gray-600">{restaurant.description}</p>
          )}

          {(restaurant.instagram || restaurant.tiktok || restaurant.facebook) && (
            <div className="mt-4 flex items-center gap-3 border-t border-gray-100 pt-4">
              {restaurant.instagram && (
                <a
                  href={`https://instagram.com/${restaurant.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-pink-500"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {restaurant.tiktok && (
                <a
                  href={`https://tiktok.com/@${restaurant.tiktok}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-gray-900"
                  aria-label="TikTok"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.88-2.88 2.89 2.89 0 012.88-2.88c.28 0 .56.04.82.11v-3.5a6.37 6.37 0 00-.82-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.35 6.34 6.34 0 006.34-6.34V8.93a8.22 8.22 0 003.76.92V6.4s-.01.29 0 .29z" />
                  </svg>
                </a>
              )}
              {restaurant.facebook && (
                <a
                  href={`https://facebook.com/${restaurant.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-blue-600"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
            </div>
          )}
        </div>

        {tabCategories.length > 0 && (
          <CategoryTabs
            variant="menu"
            categories={tabCategories}
            activeId={activeCategory}
            onSelect={setActiveCategory}
            accentBg={theme.accentBg}
          />
        )}

        {/* Platillos */}
        <div className="mt-4 pb-8">
          {activeCategory === ALL_CATEGORY_ID ? (
            <div className="flex flex-col gap-10">
              {categories.map((cat) => (
                <section key={cat.id} className="scroll-mt-28">
                  <h2 className="mb-4 text-xl font-bold text-gray-900">{cat.name}</h2>
                  <div className={itemsLayoutClass}>
                    {cat.items.map((item) => (
                      <RestaurantMenuItemRow
                        key={item.id}
                        item={item}
                        onAdd={handleAddClick}
                        cardClassName={itemCardClass}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <>
              <h2 className="mb-4 text-xl font-bold text-gray-900">{activeCategoryName}</h2>
              <div className={itemsLayoutClass}>
                {activeItems.map((item) => (
                  <RestaurantMenuItemRow
                    key={item.id}
                    item={item}
                    onAdd={handleAddClick}
                    cardClassName={itemCardClass}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <CartFloatingBarUix
        variant="whatsapp"
        cartCount={totalItems}
        total={cart.total()}
        onOpen={() => setCartOpen(true)}
      />
      <CartModal
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        restaurantName={restaurant.name}
        restaurantSlug={slug}
        deliveryZones={deliveryZones}
      />
      <CustomizationModal
        item={customItem}
        isOpen={!!customItem}
        onClose={() => setCustomItem(null)}
        onConfirm={(base, extras, removed) => {
          const unitPrice = base.price + extras.reduce((s, e) => s + e.price, 0);
          const lineId = buildCartLineId(base.id, extras, removed);
          cart.addItem(
            {
              lineId,
              id: base.id,
              restaurantId: restaurant.id,
              name: base.name,
              price: unitPrice,
              chosenExtras: extras.length ? extras : undefined,
              chosenExclusions: removed.length ? removed : undefined,
            },
            restaurant.name,
            restaurant.whatsapp || ''
          );
          setCustomItem(null);
        }}
      />
    </div>
  );
}
