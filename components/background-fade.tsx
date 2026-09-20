/**
 * Site-wide background fade, same values as the IT Smart billing platform: a
 * sky-blue glow top-left, a faint orange glow bottom-right and a diagonal wash
 * from the page colour to white.
 *
 * Render it as the first child of a `relative` container. It fills that
 * container and sits behind its content, so the fade begins wherever the
 * container begins (on the home page, straight after the hero). The glow radii
 * are viewport-relative so they look the same whether the container is one
 * screen tall or a whole page.
 */
export default function BackgroundFade() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_42vw_at_top_left,_rgba(103,200,236,0.24),_transparent),radial-gradient(circle_35vw_at_bottom_right,_rgba(247,159,49,0.12),_transparent),linear-gradient(135deg,_#f6fdfe_0%,_#eefafe_58%,_#ffffff_100%)]"
    />
  );
}
