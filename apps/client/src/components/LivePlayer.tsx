function LivePlayer() {
  return (
    <section className="w-full aspect-video flex-grow min-h-[70%]">
      <video autoPlay className="w-full h-full bg-surface-alt rounded-xl" />
    </section>
  );
}

export default LivePlayer;
