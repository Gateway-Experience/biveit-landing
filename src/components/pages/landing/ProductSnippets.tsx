// Intentions: small pieces of the product used as pictures on the landing page (the browser bar's dots),
// shared by the hero, the how-it-works demo and the gallery.

// The three little dots of a browser window's top bar.
function BrowserDots() {
  return (
    <div className='flex shrink-0 gap-1'>
      {[0, 1, 2].map(index => <span key={index} className='size-2 rounded-full bg-foreground/15' />)}
    </div>
  );
}

export {
  BrowserDots,
};
