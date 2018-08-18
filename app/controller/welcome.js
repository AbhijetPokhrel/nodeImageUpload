
export const index = function (knode,writer) {
    writer.write(knode.view("views/welcome.html", {msg: {txt: "Hello !! "}}));
}
