export default function Table({ columns, data, actions }) {
  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>{columns.map(c => <th key={c.key} className="text-left px-4 py-3 font-semibold text-slate-700">{c.label}</th>)}
            {actions && <th className="px-4 py-3"></th>}</tr>
        </thead>
        <tbody>
          {data.length === 0 && <tr><td colSpan={columns.length+1} className="text-center text-slate-400 py-8">No records found</td></tr>}
          {data.map((row, i) => (
            <tr key={row._id || i} className="border-b border-slate-100 hover:bg-slate-50">
              {columns.map(c => <td key={c.key} className="px-4 py-3">{c.render ? c.render(row) : row[c.key]}</td>)}
              {actions && <td className="px-4 py-3 text-right">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
