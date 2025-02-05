interface Sale {
    id: string;
    product: {
        name: string
    };
    quantity: number;
    price: number;
    userId: string;
    user: {
        username: string
    }
}

interface SalesProps {
    sales?: Sale[];
}

const SalesList: React.FC<SalesProps> = ({ sales }) => {
    return (
        <>
            {sales && sales.length > 0 ? (
                sales.map((sale, idx) => (
                    <tr key={idx}>
                        <th>{sale.product.name}</th>
                        <td>{sale.quantity}</td>
                        <td>&#8358; {sale.price}</td>
                        <td>{sale.user.username}</td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td col-span="4"></td>
                </tr>
            )}
        </>
    );
};
export default SalesList
