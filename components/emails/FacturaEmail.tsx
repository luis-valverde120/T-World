import * as React from 'react';

// 'pedido' será el objeto completo que buscaremos en la base de datos
export const FacturaEmail = ({ pedido }: { pedido: any }) => {
  
  // Estilos CSS en línea (obligatorio para emails)
  const containerStyle = { fontFamily: 'Arial, sans-serif', padding: '20px' };
  const headerStyle = { fontSize: '24px', fontWeight: 'bold' };
  const itemStyle = { borderBottom: '1px solid #eee', padding: '10px 0' };
  const totalStyle = { fontSize: '18px', fontWeight: 'bold', marginTop: '20px' };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>¡Gracias por tu compra en T-World!</h1>
      <p>Hola {pedido.usuario.nombre},</p>
      <p>Tu pedido ha sido confirmado. Aquí tienes el resumen:</p>
      <p><strong>Pedido ID:</strong> {pedido.id}</p>
      
      <hr style={{ margin: '20px 0' }} />

      <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Resumen de la Compra</h2>
      
      {pedido.items.map((item: any) => (
        <div key={item.id} style={itemStyle}>
          <p>
            <strong>{item.producto.nombre}</strong> (x{item.cantidad})
          </p>
          <p>Talla: {item.talla}, Color: {item.color}</p>
          <p>
            Precio: ${ (parseFloat(item.precioUnidad) * item.cantidad).toFixed(2) }
          </p>
        </div>
      ))}
      
      <div style={totalStyle}>
        <p>Total Pagado: ${pedido.total}</p>
      </div>
      
      <p style={{ marginTop: '30px' }}>
        ¡Vuelve pronto!
      </p>
    </div>
  );
};