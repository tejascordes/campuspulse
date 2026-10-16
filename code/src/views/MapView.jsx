export default function MapView() {
  return (
    <div
      className="h-full w-full flex flex-col overflow-hidden bg-white"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <div
        style={{
          flex: 1,
          maxWidth: '56rem',
          margin: '0 auto',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        className="md:py-4 md:px-2"
      >
        <div
          className="w-full h-full md:rounded-2xl md:border flex items-center justify-center overflow-auto"
          style={{
            borderColor: '#DDDDDD',
            backgroundColor: '#C5E1A5',
          }}
        >
          <img
            src="/campus_map.jpg"
            alt="Thapar Campus Map"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>
      </div>
    </div>
  )
}
