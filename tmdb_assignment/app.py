import requests
from collections import defaultdict 
from flask import Flask, request, render_template
app = Flask(__name__)

@app.route("/")
def main():
    return render_template('index.html')

@app.route("/gettrending")
def get_trending_movies(): 

    trending_movies_response = requests.get(
                                            url="https://api.themoviedb.org/3/trending/movie/week",
                                            params = {
                                                'api_key': '0ba6a440f1ad1b9a193be201a90612d3'
                                            }
                                        )
    trending_movies_obj = trending_movies_response.json()   
    trending_movies_res = trending_movies_obj["results"]
    trending_movies = defaultdict(list)
    i = 0
    while i < 5:
        trending_movies[trending_movies_res[i]['title']].append(trending_movies_res[i]['backdrop_path'])
        trending_movies[trending_movies_res[i]['title']].append(trending_movies_res[i]['release_date'])
        i += 1

    tv_airing_today_response = requests.get(
                                            url="https://api.themoviedb.org/3/tv/airing_today",
                                            params = {
                                                'api_key': '0ba6a440f1ad1b9a193be201a90612d3'
                                            }
                                        )
    tv_airing_today_response_obj = tv_airing_today_response.json()   
    tv_airing_today_response_res = tv_airing_today_response_obj["results"]
    tv_airing_today = defaultdict(list)
    i = 0
    while i < 5:
        tv_airing_today[tv_airing_today_response_res[i]['name']].append(tv_airing_today_response_res[i]['backdrop_path'])
        tv_airing_today[tv_airing_today_response_res[i]['name']].append(tv_airing_today_response_res[i]['first_air_date'])
        i += 1

    return {'0': trending_movies, '1': tv_airing_today}

@app.route("/movie")
def get_movie():

    movie_result = defaultdict(lambda: defaultdict(list))
    query = request.args.get('query', None)
    print(query)
    movie_response = requests.get(
                                    url="https://api.themoviedb.org/3/search/movie", 
                                    params = {
                                        'api_key': '0ba6a440f1ad1b9a193be201a90612d3',
                                        'language' : 'en-US',
                                        'query' : query,
                                        'page' : '1',
                                        'include-adult' : 'false'
                                    }
                                )
    movie_response_obj = movie_response.json()  
    for i in range(len(movie_response_obj['results'])):
        movie_result[movie_response_obj['results'][i]['id']] = {'title': movie_response_obj['results'][i]['title'], 'overview': movie_response_obj['results'][i]['overview'], 'poster_path': movie_response_obj['results'][i]['poster_path'],
                            'release_date': movie_response_obj['results'][i]['release_date'], 'vote_average': movie_response_obj['results'][i]['vote_average'], 'vote_count': movie_response_obj['results'][i]['vote_count'], 'genre_ids': movie_response_obj['results'][i]['genre_ids']}
        if movie_result[movie_response_obj['results'][i]['id']]["vote_average"] > 5.0:
                movie_result[movie_response_obj['results'][i]['id']]["vote_average"] /= 2
    return movie_result

@app.route("/tvshow")
def get_tv():

    tv_result = defaultdict(lambda: defaultdict(list))
    query = request.args.get('query', None)
    print(query)
    tv_response = requests.get(
                                    url="https://api.themoviedb.org/3/search/tv", 
                                    params = {
                                        'api_key': '0ba6a440f1ad1b9a193be201a90612d3',
                                        'language' : 'en-US',
                                        'page' : '1',
                                        'query' : query,                                        
                                        'include_adult' : 'false'
                                    }
                                )
    tv_response_obj = tv_response.json()  
    for i in range(len(tv_response_obj['results'])):
        tv_result[tv_response_obj['results'][i]['id']] = {'title': tv_response_obj['results'][i]['name'], 'overview': tv_response_obj['results'][i]['overview'], 'poster_path': tv_response_obj['results'][i]['poster_path'],
                            'release_date': tv_response_obj['results'][i]['first_air_date'], 'vote_average': tv_response_obj['results'][i]['vote_average'], 'vote_count': tv_response_obj['results'][i]['vote_count'], 'genre_ids': tv_response_obj['results'][i]['genre_ids']} 
        if tv_result[tv_response_obj['results'][i]['id']]["vote_average"] > 5.0:
                tv_result[tv_response_obj['results'][i]['id']]["vote_average"] /= 2
    return tv_result

@app.route("/multisearch")
def get_multi_search():

    multi_search = defaultdict(lambda: defaultdict(list))
    query = request.args.get('query', None)
    print(query)
    multi_response = requests.get(
                                    url="https://api.themoviedb.org/3/search/multi", 
                                    params = {
                                        'api_key': '0ba6a440f1ad1b9a193be201a90612d3',
                                        'language' : 'en-US',
                                        'query' : query,
                                        'page' : '1',
                                        'include_adult' : 'false'
                                    }
                                )

    multi_response_obj = multi_response.json()

    for i in range(len(multi_response_obj['results'])):
        if multi_response_obj['results'][i]["media_type"] == "tv":
            multi_search[multi_response_obj['results'][i]['id']] = {'media_type': "tvshow", 'title': multi_response_obj['results'][i]['name'], 'overview': multi_response_obj['results'][i]['overview'], 'poster_path': multi_response_obj['results'][i]['poster_path'],
                                'release_date': multi_response_obj['results'][i]['first_air_date'], 'vote_average': multi_response_obj['results'][i]['vote_average'], 'vote_count': multi_response_obj['results'][i]['vote_count'], 'genre_ids': multi_response_obj['results'][i]['genre_ids']} 
            if multi_search[multi_response_obj['results'][i]['id']]["vote_average"] > 5.0:
                multi_search[multi_response_obj['results'][i]['id']]["vote_average"] /= 2
        elif multi_response_obj['results'][i]["media_type"] == "movie":
            multi_search[multi_response_obj['results'][i]['id']] = {'media_type': "movies",'title': multi_response_obj['results'][i]['title'], 'overview': multi_response_obj['results'][i]['overview'], 'poster_path': multi_response_obj['results'][i]['poster_path'],
                            'release_date': multi_response_obj['results'][i]['release_date'], 'vote_average': multi_response_obj['results'][i]['vote_average'], 'vote_count': multi_response_obj['results'][i]['vote_count'], 'genre_ids': multi_response_obj['results'][i]['genre_ids']}
            if multi_search[multi_response_obj['results'][i]['id']]["vote_average"] > 5.0:
                multi_search[multi_response_obj['results'][i]['id']]["vote_average"] /= 2
    
    return multi_search

@app.route("/moviedetails")
def get_movie_details():

    movie_details_result = {}
    movie_id = request.args.get('id', None)
    movie_details = requests.get(
                                    url="https://api.themoviedb.org/3/movie/{}".format(movie_id), 
                                    params = {
                                        'api_key': '0ba6a440f1ad1b9a193be201a90612d3',
                                        'language' : 'en-US'
                                    }
                                )

    movie_details_obj = movie_details.json()  
    movie_details_result['id'] = movie_details_obj['id']
    movie_details_result['title'] = movie_details_obj['title']
    movie_details_result['overview'] = movie_details_obj['overview']
    movie_details_result['release_date'] = movie_details_obj['release_date']
    movie_details_result['spoken_languages'] = movie_details_obj['spoken_languages']
    print(movie_details_obj['vote_average'] / 2)
    if movie_details_obj['vote_average']:
        if movie_details_obj['vote_average'] > 5.0 :
            movie_details_result['vote_average'] = movie_details_obj['vote_average'] / 2
        else:
            movie_details_result['vote_average'] = movie_details_obj['vote_average']  
    movie_details_result['vote_count'] = movie_details_obj['vote_count']
    movie_details_result['poster_path'] = movie_details_obj['poster_path']    
    movie_details_result['backdrop_path'] = movie_details_obj['backdrop_path']
    movie_details_result['genres'] = movie_details_obj['genres']    

    return movie_details_result

@app.route("/moviecredits")
def get_movie_credits():

    movie_credit = defaultdict(lambda: defaultdict(list))
    movie_id = request.args.get('id', None)
    movie_credit_details = requests.get(
                                            url = "https://api.themoviedb.org/3/movie/{}/credits".format(movie_id), 
                                            params = {
                                                'api_key': '0ba6a440f1ad1b9a193be201a90612d3',
                                                'language' : 'en-US'
                                            }
                                        )
    movie_credits_obj = movie_credit_details.json()

    #https://image.tmdb.org/t/p/w500/imagepath
    r = min(8, len(movie_credits_obj['cast']))
    for i in range(r):
        movie_credit[i] = {"name": movie_credits_obj['cast'][i]['name'], "profile_path": movie_credits_obj['cast'][i]['profile_path'], 
                            "character": movie_credits_obj['cast'][i]['character']}

    return movie_credit

@app.route("/moviereview")    
def get_movie_review():

    movie_review = defaultdict(lambda: defaultdict(list))
    movie_id = request.args.get('id', None)
    movie_review_details = requests.get(
                                            url = "https://api.themoviedb.org/3/movie/{}/reviews".format(movie_id), 
                                            params = {
                                                'api_key': '0ba6a440f1ad1b9a193be201a90612d3',
                                                'language' : 'en-US',
                                                'page' : '1'
                                            }
                                        )
    movie_reviews_obj = movie_review_details.json()

    if movie_reviews_obj['results']:
        for i in range(min(5, len(movie_reviews_obj['results']))):
            movie_review[i] = {"username": movie_reviews_obj['results'][i]['author_details']['username'], "content": movie_reviews_obj['results'][i]['content'], 
                                "rating": movie_reviews_obj['results'][i]['author_details']['rating'], "created_at": movie_reviews_obj['results'][i]['created_at']}

            if movie_review[i]["rating"]:
                if movie_review[i]["rating"] > 5.0:
                    movie_review[i]["rating"] /= 2

    return movie_review

@app.route("/tvshowdetails")    
def get_tv_show_details():

    tv_show_details_result = {}
    tv_id = request.args.get('id', None)
    movie_details = requests.get(
                                    url="https://api.themoviedb.org/3/tv/{}".format(tv_id), 
                                    params = {
                                        'api_key': '0ba6a440f1ad1b9a193be201a90612d3',
                                        'language': 'en-US'
                                    }
                                )

    tv_details_obj = movie_details.json()  
    tv_show_details_result['id'] = tv_details_obj['id']
    tv_show_details_result['title'] = tv_details_obj['name']
    tv_show_details_result['episode_run_time'] = tv_details_obj['episode_run_time']
    tv_show_details_result['release_date'] = tv_details_obj['first_air_date']
    tv_show_details_result['spoken_languages'] = tv_details_obj['spoken_languages']
    tv_show_details_result['vote_average'] = tv_details_obj['vote_average']  
    tv_show_details_result['vote_count'] = tv_details_obj['vote_count']
    tv_show_details_result['poster_path'] = tv_details_obj['poster_path']    
    tv_show_details_result['backdrop_path'] = tv_details_obj['backdrop_path']
    tv_show_details_result['genres'] = tv_details_obj['genres'] 
    tv_show_details_result['overview'] = tv_details_obj['overview']
    tv_show_details_result['number_of_seasons'] = tv_details_obj['number_of_seasons']    

    return tv_show_details_result

@app.route("/tvcredits")
def get_tv_credits():

    tv_credit = defaultdict(lambda: defaultdict(list))
    tv_id = request.args.get('id', None)
    tv_credit_details = requests.get(
                                            url = "https://api.themoviedb.org/3/tv/{}/credits".format(tv_id), 
                                            params = {
                                                'api_key': '0ba6a440f1ad1b9a193be201a90612d3',
                                                'language' : 'en-US'
                                            }
                                        )
    tv_credits_obj = tv_credit_details.json()

    #https://image.tmdb.org/t/p/w500/imagepath
    r = min(8, len(tv_credits_obj["cast"]))
    for i in range(r):
        tv_credit[i] = {"name": tv_credits_obj['cast'][i]['name'], "profile_path": tv_credits_obj['cast'][i]['profile_path'], 
                            "character": tv_credits_obj['cast'][i]['character']}

    return tv_credit

@app.route("/tvreview")    
def get_tv_review():

    tv_review = defaultdict(lambda: defaultdict(list))
    tv_id = request.args.get('id', None)
    tv_review_details = requests.get(
                                            url = "https://api.themoviedb.org/3/tv/{}/reviews".format(tv_id), 
                                            params = {
                                                'api_key': '0ba6a440f1ad1b9a193be201a90612d3',
                                                'language': 'en-US',
                                                'page' : '1'
                                            }
                                        )
    tv_reviews_obj = tv_review_details.json()

    for i in range(min(5, len(tv_reviews_obj['results']))):
        tv_review[i] = {"username": tv_reviews_obj['results'][i]['author_details']['username'], "content": tv_reviews_obj['results'][i]['content'], 
                            "rating": tv_reviews_obj['results'][i]['author_details']['rating'], "created_at": tv_reviews_obj['results'][i]['created_at']}
        if tv_review[i]["rating"] > 5.0:
            tv_review[i]["rating"] /= 2

    return tv_review

@app.route("/moviegenre")
def movie_genre():  
    movie_genre_ret = {}
    movie_genre = requests.get(
                                            url = "https://api.themoviedb.org/3/genre/movie/list", 
                                            params = {
                                                'api_key': '0ba6a440f1ad1b9a193be201a90612d3',
                                                'language': 'en-US'
                                            }
                                        )

    movie_genre_obj = movie_genre.json()
    for i in movie_genre_obj["genres"]:
        movie_genre_ret[i["id"]] = i["name"]
    
    return movie_genre_ret

@app.route("/tvgenre")
def tv_genre():  
    tv_genre_ret = {}
    tv_genre = requests.get(
                                            url = "https://api.themoviedb.org/3/genre/tv/list", 
                                            params = {
                                                'api_key': '0ba6a440f1ad1b9a193be201a90612d3',
                                                'language': 'en-US'
                                            }
                                        )

    tv_genre_obj = tv_genre.json()
    for i in tv_genre_obj["genres"]:
        tv_genre_ret[i["id"]] = i["name"]

    return tv_genre_ret

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5002,debug=True)