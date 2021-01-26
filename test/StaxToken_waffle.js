const { expect } = require("chai");

// Waffle test
describe("StaxToken (Waffle)", function () {
    before(async function () {
        [minter, alice, bob, ...addrs] = await ethers.getSigners();

        const StaxToken = await hre.ethers.getContractFactory("StaxToken");
        staxToken = await StaxToken.deploy();

        await staxToken.deployed();
    });

    describe("StaxToken is deployed properly", function () {
        it("Verify parameters are fine", async function () {
            expect(await staxToken.name()).to.equal("StableX Token");
            expect(await staxToken.symbol()).to.equal("STAX");
            expect(await staxToken.totalSupply()).to.equal("0");
            expect(await staxToken.owner()).to.equal(minter.address);
        });

        it("Verify that owner can mint", async function () {
            await staxToken
                .connect(minter)
                .mint(minter.address, "500000000000000000000"); // 500 STAX
            expect(await staxToken.totalSupply()).to.equal("500000000000000000000");
            expect(await staxToken.balanceOf(minter.address)).to.equal(
                "500000000000000000000"
            );
        });

        it("Verify that only the owner can mint", async function () {
            await expect(
                staxToken.connect(bob).mint(bob.address, "500000000000000000000")
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });
});
