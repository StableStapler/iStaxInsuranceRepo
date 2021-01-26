const { assert } = require("chai");
const { expectEvent, expectRevert } = require("@openzeppelin/test-helpers");

const StaxToken = artifacts.require("./StaxToken.sol");

// Truffle test
contract("StaxToken (Truffle test)", ([minter, alice, bob]) => {
    let staxToken;
    before(async function () {
        staxToken = await StaxToken.deploy({ from: minter });
    });

    describe("StaxToken is deployed properly", function () {
        it("Verify parameters are fine", async function () {
            assert.equal(await staxToken.name(), "StableX Token");
            assert.equal(await staxToken.symbol(), "STAX");
            assert.equal(await staxToken.totalSupply(), "0");
            assert.equal(await staxToken.owner(), minter);
        });

        it("Verify that owner can mint", async function () {
            await staxToken.mint(minter, "500000000000000000000", { from: minter }); // 500 STAX
            assert.equal(await staxToken.totalSupply(), "500000000000000000000");
            assert.equal(await staxToken.balanceOf(minter), "500000000000000000000");
        });

        it("Verify that only the owner can mint", async function () {
            await expectRevert(
                staxToken.mint(bob.address, "500000000000000000000", { from: bob }),
                "Ownable: caller is not the owner"
            );
        });
    });
});
