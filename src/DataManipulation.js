class Favorites {
    constructor(root) {
        this.root = root;
    }
}

export class MyFavorites extends Favorites {
    constructor(root){
        super(root)
    }
}