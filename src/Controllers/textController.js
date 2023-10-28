const submitText = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId)
      return res.render("errorPage", {
        message: "Unauthorized User. You have to Login first!",
      });

    const data = req.body;
    const { messageText } = data;
    res.cookie(userId, messageText);

    const myCookieValue = req.cookies[userId];
    return res.render("Logout", { data: myCookieValue });

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const searchText = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId)
      return res.render("errorPage", {
        message: "Unauthorized User. You have to Login first!",
      });

    const searchMessageText = req.query.searchMessageText;
    const searchedCookie = req.cookies[userId];

    if (searchedCookie) {
      if (searchedCookie.includes(searchMessageText)) {
        // res.send(`Found in Cookie: ${inputCookie}`);
        return res.render("Logout", { data: searchedCookie });
      } else {
        // res.send('Not found in Cookie.');
        return res.render("Logout", { data: "no message found" });
      }
    } else {
      // res.send('No inputCookie found in cookies.');
      return res.render("Logout", { data: "no message found" });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const clearCookies = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId)
      return res.render("errorPage", {
        message: "Unauthorized User. You have to Login first!",
      });

    // Clear all cookies.
    res.clearCookie(userId);

    // Send a response to the client.
    // return res.render("errorPage", {
    //   message: "Cookie cleared successfully",
    // });
    return res.render("Logout", { data: "no message found" });

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { submitText, searchText, clearCookies };
