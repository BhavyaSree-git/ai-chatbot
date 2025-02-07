from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_mysqldb import MySQL

app = Flask(__name__)
CORS(app)

# MySQL Database Configuration
app.secret_key = 'abcdefghijklmnopqirestuvwxyz'
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'chatbot_db'

# Initialize MySQL
mysql = MySQL(app)

@app.route("/api/query", methods=["GET"])
def process_query():
    query = request.args.get("query", "").strip().lower()
    cur = mysql.connection.cursor()

    # Handle greetings (hi, hello, etc.) by showing all available products
    if query in ["hi", "hello", "hey", "good morning", "good evening", "good afternoon"]:
        cur.execute("SELECT name, brand, price, category FROM products")
        products = cur.fetchall()
        return jsonify([{"name": p[0], "brand": p[1], "price": p[2], "category": p[3]} for p in products])

    # Get all brands
    elif query in ["show me all available brands", "all brands", "available brands", "show me brands", "brands"]:
        cur.execute("SELECT DISTINCT brand FROM products")
        brands = cur.fetchall()
        return jsonify([{"brand": b[0]} for b in brands])

    # Get all products
    elif query in ["show me all available products", "all products", "available products", "show me products", "products"]:
        cur.execute("SELECT name, brand, price, category FROM products")
        products = cur.fetchall()
        return jsonify([{"name": p[0], "brand": p[1], "price": p[2], "category": p[3]} for p in products])

    # Get lowest price brand
    elif query in ["less price brand", "cheapest brand", "low budget brand", "which brand has the lowest price products?"]:
        cur.execute("SELECT brand, MIN(price) FROM products GROUP BY brand ORDER BY MIN(price) ASC LIMIT 1")
        brand = cur.fetchone()
        if brand:
            return jsonify({"brand": brand[0], "lowest_price": brand[1]})
        else:
            return jsonify({"message": "No brand information available."})

    # Get lowest price product
    elif query in ["show me the cheapest product", "lowest product", "low budget products", "less price products"]:
        cur.execute("SELECT name, brand, price, category FROM products ORDER BY price ASC LIMIT 1")
        product = cur.fetchone()
        if product:
            return jsonify({"name": product[0], "brand": product[1], "price": product[2], "category": product[3]})
        else:
            return jsonify({"message": "No products available."})

    # Get highest price product
    elif query in ["show me the most expensive product", "highest product", "high budget products"]:
        cur.execute("SELECT name, brand, price, category FROM products ORDER BY price DESC LIMIT 1")
        product = cur.fetchone()
        if product:
            return jsonify({"name": product[0], "brand": product[1], "price": product[2], "category": product[3]})
        else:
            return jsonify({"message": "No products available."})

    # Get product and category
    elif query in ["show me products and their categories", "all products and categories"]:
        cur.execute("SELECT name, category FROM products")
        products = cur.fetchall()
        return jsonify([{"name": p[0], "category": p[1]} for p in products])

    # Show all products under a specific brand
    elif query.startswith("show me all products under brand"):
        brand_name = query.replace("show me all products under brand ", "").strip()
        cur.execute("SELECT name, brand, price, category FROM products WHERE brand = %s", (brand_name,))
        products = cur.fetchall()
        return jsonify([{"name": p[0], "brand": p[1], "price": p[2], "category": p[3]} for p in products])

    # Show all suppliers providing a specific category
    elif query.startswith("which suppliers provide"):
        category_name = query.replace("which suppliers provide ", "").strip()
        cur.execute("""
            SELECT suppliers.name, products.category, products.price 
            FROM suppliers 
            JOIN products ON suppliers.id = products.supplier_id 
            WHERE products.category = %s
        """, (category_name,))
        suppliers = cur.fetchall()
        return jsonify([{"supplier_name": s[0], "category": s[1], "price": s[2]} for s in suppliers])

    # Show details of a specific product
    elif query.startswith("give me details of product"):
        product_name = query.replace("give me details of product ", "").strip()
        cur.execute("SELECT name, brand, price, category FROM products WHERE name = %s", (product_name,))
        product = cur.fetchone()
        if product:
            return jsonify({"name": product[0], "brand": product[1], "price": product[2], "category": product[3]})
        else:
            return jsonify({"message": f"No details found for product {product_name}."})

    else:
        return jsonify({"message": "Invalid query. Try asking about brands, suppliers, or product details."})

if __name__ == '__main__':
    app.run(debug=True)
