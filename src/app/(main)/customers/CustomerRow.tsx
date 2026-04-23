import React from "react";
import { MappedCustomer } from "./customer";

interface Props {
  customer: MappedCustomer;
}

export const CustomerRow: React.FC<Props> = ({ customer }) => {
  return (
    <tr>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div 
            style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 8, 
              background: '#e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: 14
            }}
          >
            {customer.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 500 }}>{customer.name}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>{customer.mobile}</div>
          </div>
        </div>
      </td>
      <td>{customer.accountShort}</td>
      <td>{customer.bank}</td>
      <td>
        <span style={{ 
          padding: '2px 8px', 
          background: '#dbeafe', 
          color: '#1e40af', 
          borderRadius: 4, 
          fontSize: 12,
          fontWeight: 500
        }}>
          {customer.type}
        </span>
      </td>
      <td>{customer.lastPrint}</td>
      <td>
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="btn btn-ghost btn-xs">✏️</button>
          <button className="btn btn-ghost btn-xs">🗑️</button>
          <button className="btn btn-ghost btn-xs">📄</button>
        </div>
      </td>
    </tr>
  );
};
