function Card({title, description, func}) {
    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">{description}</p>

                <button onClick={() => func(title)} type="button" className="btn btn-primary">
                    Go somewhere
                </button>
            </div>
        </div>
    )
}

export default Card;