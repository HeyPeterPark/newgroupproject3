import os
import pandas as pd
import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///static/data/airbnb.db'
db = SQLAlchemy(app)

Base = automap_base()
Base.prepare(db.engine, reflect=True)

listings = Base.classes.listings
reviews = Base.classes.reviews

@app.route("/")
def home():
    return "Welcome!"
#     return render_template("neighborhoods_to_delete.html")


@app.route("/temp")
# def hood_average(hood):
def hood_average():
    sel = [
        listings.neighbourhood
        , func.avg(listings.price)
        # , listings.month_test
    ]

    results = db.session.query(*sel).group_by(listings.neighbourhood).all()
    
    return jsonify(results)

    # hood_metadata = {}
    # for result in results:
    #     hood_metadata["host_id"] = result[0]
    #     hood_metadata["neighbourhood"] = result[1]
    #     hood_metadata["latitude"] = result[2]
    #     # hood_metadata["longitude"] = result[3]
    #     # hood_metadata["room_type"] = result[4]
    #     # hood_metadata["price"] = result[5]
    #     # hood_metadata["minimum_nights"] = result[6]
    #     # hood_metadata["month_test"] = result[7]
    #     # hood_metadata["price_range"] = result[8]

    # return jsonify(hood_metadata)




@app.route("/metadata/<hood>")
def hood_metadata(hood):
    sel = [
        listings.host_id
        , listings.neighbourhood
        , listings.latitude
        , listings.longitude
        , listings.room_type
        , listings.price
        , listings.minimum_nights
        , listings.month_test
        , listings.price_range
    ]

    # results = db.session.query(*sel).filter(Samples_Metadata.sample == sample).all()
    results = db.session.query(*sel).all()

    hood_metadata = {}
    for result in results:
        hood_metadata["host_id"] = result[0]
        hood_metadata["neighbourhood"] = result[1]
        hood_metadata["latitude"] = result[2]
        hood_metadata["longitude"] = result[3]
        hood_metadata["room_type"] = result[4]
        hood_metadata["price"] = result[5]
        hood_metadata["minimum_nights"] = result[6]
        hood_metadata["month_test"] = result[7]
        hood_metadata["price_range"] = result[8]

    # print(hood_metadata)
    return jsonify(hood_metadata)



# @app.route("/neighborhood/<hood>")
# def samples(hood):

# @app.route("/neighborhood/")
# def samples():
#     """Return `otu_ids`, `otu_labels`,and `sample_values`."""
#     stmt = db.session.query(listings).statement
#     df = pd.read_sql_query(stmt, db.session.bind)

#     # Filter the data based on the sample number and
#     # only keep rows with values above 1
#     sample_data = df.loc[df[sample] > 1, ["otu_id", "otu_label", sample]]

#     # Sort by sample
#     sample_data.sort_values(by=sample, ascending=False, inplace=True)

#     # Format the data to send as json
#     data = {
#         "otu_ids": sample_data.otu_id.values.tolist(),
#         "sample_values": sample_data[sample].values.tolist(),
#         "otu_labels": sample_data.otu_label.tolist(),
#     }
#     return jsonify(data)


if __name__ == "__main__":
    app.run()
