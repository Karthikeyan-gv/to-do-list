import { useState, useEffect } from "react";

function Todolist() {
    const [items, setItems] = useState(() => {
        const storedItems = localStorage.getItem("todolist-items");
        return storedItems ? JSON.parse(storedItems) : [];
    });

    const [newItem, setNewItem] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        localStorage.setItem("todolist-items", JSON.stringify(items));
    }, [items]);

    useEffect(() => {
        if (searchTerm && filteredItems.length === 0) {
            setNotFound(true);
            const timeout = setTimeout(() => {
                setSearchTerm("");
                setNotFound(false);
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [searchTerm]);

    function addItem() {
        if (newItem.trim() === "") return;
        const newTodo = {
            id: Date.now(),
            name: newItem.trim(),
            age: Math.floor(Math.random() * 50) + 20,
            checked: false,
        };
        setItems([...items, newTodo]);
        setNewItem("");
    }

    function checkbox(id) {
        const updatedItems = items.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
        );
        setItems(updatedItems);
    }

    function deleteBox(id) {
        const itemToDelete = items.find((item) => item.id === id);
        const confirmDelete = window.confirm(`Are you sure you want to delete "${itemToDelete.name}"?`);
        if (confirmDelete) {
            const deletedItems = items.filter((item) => item.id !== id);
            setItems(deletedItems);
        }
    }

    function startEdit(id, currentName) {
        setEditId(id);
        setEditName(currentName);
    }

    function saveEdit(id) {
        if (editName.trim() === "") return;
        const updatedItems = items.map((item) =>
            item.id === id ? { ...item, name: editName.trim() } : item
        );
        setItems(updatedItems);
        setEditId(null);
        setEditName("");
    }

    function clearAll() {
        const confirmClear = window.confirm("Are you sure you want to clear the entire list?");
        if (confirmClear) {
            setItems([]);
        }
    }

    const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="todo-container">
            <h1>TO DO LIST</h1>
            <p className="credits">BY KARTHIKEYAN</p>
            <div className="controls">
                <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Add new item"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                />
                <button onClick={addItem}>Add</button>
                <button onClick={clearAll} disabled={items.length === 0}>
                    Clear All
                </button>
            </div>

            <main className="listitems">
                {filteredItems.length === 0 ? (
                    notFound ? (
                        <p className="empty">❌ No match found. Clearing search...</p>
                    ) : (
                        <p className="empty">📭 List is empty</p>
                    )
                ) : (
                    <ul className="ul">
                        {filteredItems.map((item) => (
                            <li key={item.id} className="list-item">
                                <input
                                    id={`checkbox-${item.id}`}
                                    type="checkbox"
                                    checked={item.checked}
                                    onChange={() => checkbox(item.id)}
                                />
                                {editId === item.id ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                        />
                                        <button onClick={() => saveEdit(item.id)}>Save</button>
                                    </>
                                ) : (
                                    <>
                                        <label
                                            htmlFor={`checkbox-${item.id}`}
                                            style={{ textDecoration: item.checked ? "line-through" : "none" }}
                                        >
                                            {item.name}
                                        </label>
                                        <button onClick={() => startEdit(item.id, item.name)}>Rename</button>
                                    </>
                                )}
                                <button onClick={() => deleteBox(item.id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
}

export default Todolist;
