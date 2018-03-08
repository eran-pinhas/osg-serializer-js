module.exports = {

    /** means that associated GLMode and Override is disabled.*/
    OFF: 0,
    /** means that associated GLMode is enabled and Override is disabled.*/
    ON: 1,
    /** Overriding of GLMode's or StateAttributes is enabled, so that state below it is overridden.*/
    OVERRIDE: 2,
    /** Protecting of GLMode's or StateAttributes is enabled, so that state from above cannot override this and below state.*/
    PROTECTED: 4,
    /** means that GLMode or StateAttribute should be inherited from above.*/
    INHERIT: 8

};