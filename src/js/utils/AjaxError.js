export default class AjaxError extends Error {
    constructor(jqXHR, textStatus, errorThrown) {
        super(textStatus);
        this.name = "AjaxError";
        this.message = `${textStatus}${jqXHR.responseJSON && jqXHR.responseJSON.message ? `: ${jqXHR.responseJSON.message}`  : ''}`;
        this.jqXHR = jqXHR;
        this.errorThrown = errorThrown;
    }
};