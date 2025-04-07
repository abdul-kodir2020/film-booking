const utilisateurs = [
    {
      id: 101,
      nom: "Jean Dupuis",
      email: "jean.dupuis@example.com",
      role: "admin",
      age: 16
    },
    {
      id: 102,
      nom: "Sophie Martin",
      email: "sophie.martin@example.com",
      role: "utilisateur",
      age: 18
    },
    {
      id: 103,
      nom: "Marc Leroy",
      email: "marc.leroy@example.com",
      role: "modérateur",
      age: 25
    },
];

/*
    Ma fonction de filtre prends deux parametres : array et critere.
    array : un tableau d'objet
    critere : un critere de filtrage dans ce format : "[propriété] [filtre] [valeur]"
    exemples de critere : 
    - "age > 17"
    - "email contient sophie"
    - "role est utilisateur"

    Ps: Les filtres acceptés sont : 
     - Pour les propriétés numeriques : >, <, =, !=
     - Pour les propriétés string : contient, est, n_est_pas, ne_contient_pas
*/
const filter = (array, critere) => {
    if(array.length === 0) return array

    let [propriete, filtre, valeur] = critere.split(" ")
    
    if(Object.keys(array[0]).indexOf(propriete) === -1) return "La propriété n'est pas valide"

    if(typeof(array[0][propriete]) === "number"){
        if ("< > = !=".split(" ").indexOf(filtre) === -1) return "Le filtre n'est pas valide"

        valeur = Number(valeur)
        if(filtre === "<") return array.filter(el => el[propriete] < valeur)
        if(filtre === ">") return array.filter(el => el[propriete] > valeur)
        if(filtre === "!=") return array.filter(el => el[propriete] != valeur)
        return array.filter(el => el[propriete] != valeur)

    }else{
        if ("contient est n_est_pas ne_contient_pas".split(" ").indexOf(filtre) === -1) return "Le filtre n'est pas valide"

        valeur = valeur.toLowerCase()
        if(filtre === "contient") return array.filter(el => el[propriete].toLowerCase().includes(valeur))
        if(filtre === "ne_contient_pas") return array.filter(el => !el[propriete].toLowerCase().includes(valeur))
        if(filtre === "n_est_pas") return array.filter(el => el[propriete].toLowerCase() !== valeur)
        return array.filter(el => el[propriete].toLowerCase() === valeur)
    }
}

console.log(filter(utilisateurs, "nom contient sophie"))