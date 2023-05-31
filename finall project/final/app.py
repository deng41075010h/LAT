import pandas as pd
from flask import Flask, render_template, request, redirect

# 創建Flask應用程式
app = Flask(__name__)

# 讀取資料並創建DataFrame（假設名為df）
df = pd.read_csv('df_rank.csv',encoding="big5")


# 定義首頁路由
@app.route('/')
@app.route('/index')


def index():
    # 獲取排序參數
    sort_by = request.args.get('sort_by')

    # 獲取搜尋參數
    search_query = request.args.get('search_query')

    # 根據排序參數對DataFrame進行排序
    if sort_by:
        df_sorted = df.sort_values(by=sort_by, ascending=False)
    else:
        df_sorted = df

    # 根據搜尋參數過濾DataFrame
    if search_query:
        df_filtered = df_sorted[df_sorted['Name'].str.contains(search_query, na=False)]
    else:
        df_filtered = df_sorted

    # 将DataFrame转换为字典格式
    df_dict = df_filtered.to_dict(orient='records')

    # 將DataFrame傳遞到模板
    return render_template('index.html', df_filtered=df_dict, sort_by=sort_by)


# 啟動應用程式
if __name__ == '__main__':
    app.debug = True
    app.run()

