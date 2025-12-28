type Props = {
  selectedPrice?: number;
  onChange: (value?: number) => void;
};

const MaxPriceFilter = ({ selectedPrice, onChange }: Props) => {
  return (
    <div>
      <h4 className="text-md font-semibold mb-2">Max Price</h4>
      <select
        className="border border-gray-300 p-2 rounded-md w-full"
        value={selectedPrice}
        onChange={(e) =>
          onChange(e.target.value ? parseInt(e.target.value) : undefined)
        }
      >
        <option value="">Select Max Price</option>
        {[50, 100, 250, 500, 750, 1000].map((price) => (
          <option value={price}>{price}</option>
        ))}
      </select>
    </div>
  );
};

export default MaxPriceFilter;
