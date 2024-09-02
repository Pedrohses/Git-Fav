import { GithubUser } from "./GithubUser.js";

class Favorites {
    constructor(root) {
        this.root = document.querySelector(root);
        this.entries = [];  // Inicializa entries como um array vazio
        this.load();        // Carrega favoritos do localStorage
    }

    async add(username) {
        try {
            const user = await GithubUser.search(username);

            if(user.login === undefined) {
                throw new Error('Usuário não encontrado!');
            }

            // Verifica se o usuário já está na lista
            const userExists = this.entries.find(entry => entry.login === user.login);
            if (userExists) {
                throw new Error('Usuário já está nos favoritos!');
            }

            this.entries = [user, ...this.entries];
            this.save();  // Salva a lista atualizada no localStorage
            this.update();
        } catch(error) {
            alert(error.message);
        }
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('github-favorites:')) || [];
    }

    save() {
        localStorage.setItem('github-favorites:', JSON.stringify(this.entries));
    }

    delete(user) {
        this.entries = this.entries.filter(entry => entry.login !== user.login);
        this.save();  // Salva a lista atualizada no localStorage
        this.update();
    }
}

export class MyFavorites extends Favorites {
    constructor(root){
        super(root);

        this.tbody = this.root.querySelector("table tbody");
        this.update();
        this.onadd();
    }

    onadd() {
        const addButton = this.root.querySelector('.search button');
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input');
            this.add(value);
        }
    }

    update() {
        this.remove();

        if(this.entries.length > 0) {
            this.entries.forEach(user => {
                this.tbody.append(this.createRow(user));
            });
        } else {
            this.tbody.append(this.createEmptyRow());
        }
    }

    remove() {
        this.tbody.querySelectorAll("tr").forEach(row => {
            row.remove();
        });
    }

    createRow(user) {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td class="user">
                <img src="https://github.com/${user.login}.png" alt="Imagem do Github do usuário">
                <a href="https://github.com/${user.login}" target="_blank">
                    <h3>${user.name}</h3>
                    <p>/${user.login}</p>
                </a>
            </td>
            <td>${user.public_repos}</td>
            <td>${user.followers}</td>
            <td>
                <button class="remove">Remover</button>
            </td>
        `;

        tr.querySelector('.remove').addEventListener('click', () => {
            const isOk = confirm("Você tem certeza de que deseja apagar essa linha?");
            if(isOk){
                this.delete(user);
            }
        });

        return tr;
    }

    createEmptyRow() {
        const tr = document.createElement("tr");
        tr.classList.add("isEmpty");
        tr.innerHTML = `
            <td>
                <img src="./assets/star-empty-list.svg" alt="Imagem de estrela com um rostinho assutado">
                <p>Nenhum favorito ainda</p>
            </td>
        `;
        return tr;
    }
}
