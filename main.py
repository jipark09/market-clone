from fastapi import FastAPI,UploadFile,Form,Response
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.staticfiles import StaticFiles
from typing import Annotated
import sqlite3

con = sqlite3.connect('db.db', check_same_thread=False)
cur = con.cursor() #DB insert나 select할 때 필요함

cur.execute(f"""
            CREATE TABLE IF NOT EXISTS items (
        	    id INTEGER PRIMARY KEY,
	            title TEXT NOT NULL,
	            image BLOB,
	            price INTEGER NOT NULL,
	            description TEXT,
	            place TEXT NOT NULL,
	            insertAt INTEGER NOT NULL
            );
            """)

app = FastAPI()

@app.post('/signup')
def login(id:Annotated[str, Form()], 
          password:Annotated[str, Form()], 
          name:Annotated[str, Form()], 
          email:Annotated[str, Form()]):
    cur.execute(f"""
                INSERT INTO users(id, name, email, password)
                VALUES ('{id}', '{name}', '{email}', '{password}')
                """)
    con.commit()
    return '200'

@app.get('/items')
async def read_items():
    con.row_factory = sqlite3.Row # 컬럼명도 같이 들고옴
    cur = con.cursor() # DB를 가져오면서 connection의 현재 위치를 업데이트함
    rows = cur.execute(f"""
                       SELECT  * FROM items;
                       """).fetchall()
    
    return JSONResponse(jsonable_encoder([dict(row) for row in rows]))

@app.post('/items')
async def create_items(image:UploadFile,
                title:Annotated[str,Form()],
                price:Annotated[int, Form()],
                description:Annotated[str, Form()],
                place:Annotated[str, Form()],
                insertAt:Annotated[int, Form()]
                ):
    # 이미지 읽음
    image_bytes = await image.read()
    cur.execute(f"""
                INSERT INTO items (title, image, price, description, place, insertAt)
                VALUES ('{title}', '{image_bytes.hex()}', {price}, '{description}', '{place}', {insertAt})
                """)
    con.commit()
    
    # print(image, title, price, description, place)
    return '200'

@app.get('/items/{item_id}')
async def get_image(item_id):
    cur = con.cursor()
    image_bytes = cur.execute(f"""
                              SELECT image FROM items WHERE id = {item_id}
                              """).fetchone()[0]
    return Response(content=bytes.fromhex(image_bytes))


#root 는 맨 마지막에
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
