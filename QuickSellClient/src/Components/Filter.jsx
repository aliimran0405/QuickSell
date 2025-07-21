import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function Filter() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const initialCategories = searchParams.getAll('category');
    const [selectedCategories, setSelectedCategories] = useState(new Set(initialCategories));

    const handleChange = (e) => {
        const value = e.target.value;
        const newSet = new Set(selectedCategories);

        if (e.target.checked) {
            newSet.add(value);
        } else {
            newSet.delete(value);
        }

        setSelectedCategories(newSet);
    };

    useEffect(() => {
        const newParams = new URLSearchParams();
        for (let cat of selectedCategories) {
            newParams.append('category', cat);
        }

        // This will update the URL and trigger GeneralItems useEffect
        navigate(`?${newParams.toString()}`);
    }, [selectedCategories]);

    const isChecked = (value) => selectedCategories.has(value);

    const categories = [
        'tools',
        'electronics',
        'games',
        'inndoor-furniture',
        'outdoor-furniture',
        'others'
    ];

    return (
        <div className="filter-wrapper">
            <form>
                
                    <ul>
                        {categories.map((cat) => (
                            <li key={cat}>
                                <label className="cbox">
                                    <input
                                        type="checkbox"
                                        name="category"
                                        value={cat}
                                        checked={isChecked(cat)}
                                        onChange={handleChange}
                                    />
                                    {cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </label>
                            </li>
                        ))}
                    </ul>
                
            </form>
        </div>
    );
}

export default Filter;
