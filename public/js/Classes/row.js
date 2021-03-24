class Row{
    constructor(titulo, contenido){
        let htitulo = document.createElement("p");
        htitulo.className = "col1";
        htitulo.innerHTML = titulo;

        let hcontenido = document.createElement("p");
        hcontenido.className = "col2";
        hcontenido.innerHTML = contenido;

        this.div = document.createElement("div");
        this.div.className = "rowDiv";

        this.divLeft = document.createElement("div");
        this.divLeft.className = "column left";

        this.divRight = document.createElement("div");
        this.divRight.className = "column right";

        this.divLeft.appendChild(htitulo);
        this.divRight.appendChild(hcontenido);

        this.div.appendChild(this.divLeft);
        this.div.appendChild(this.divRight);
    }
}

class RowC{
    constructor(titulo, contenido){
        let htitulo = document.createElement("p");
        htitulo.className = "col1";
        htitulo.innerHTML = titulo;

        let hcontenido = document.createElement("p");
        hcontenido.className = "col2";
        hcontenido.innerHTML = contenido;

        this.div = document.createElement("div");
        this.div.className = "rowDiv";

        this.divLeft = document.createElement("div");
        this.divLeft.className = "column leftC";

        this.divRight = document.createElement("div");
        this.divRight.className = "column rightC";

        this.divLeft.appendChild(htitulo);
        this.divRight.appendChild(hcontenido);

        this.div.appendChild(this.divLeft);
        this.div.appendChild(this.divRight);
    }
}