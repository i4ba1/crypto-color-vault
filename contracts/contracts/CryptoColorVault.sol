// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract CryptoColorVault is Ownable, ReentrancyGuard {
    uint256 public claimFee = 0.001 ether;

    mapping(string => address) public colorOwner;
    mapping(address => string) public ownerColor;
    string[] public allColors;

    event ColorClaimed(address indexed claimant, string colorHex, uint256 fee);

    constructor() Ownable(msg.sender) {}

    function claimColor(string memory _colorHex) public payable nonReentrant {
        require(bytes(_colorHex).length == 7, "Invalid hex format: must be 7 chars");
        require(bytes(_colorHex)[0] == "#", "Invalid hex format: must start with #");

        for (uint256 i = 1; i < 7; i++) {
            bytes1 char = bytes(_colorHex)[i];
            require(
                (char >= 0x30 && char <= 0x39) ||
                (char >= 0x41 && char <= 0x46),
                "Invalid hex format"
            );
        }

        require(msg.value == claimFee, "Incorrect fee amount");
        require(colorOwner[_colorHex] == address(0), "Color already claimed");
        require(bytes(ownerColor[msg.sender]).length == 0, "Already own a color");

        colorOwner[_colorHex] = msg.sender;
        ownerColor[msg.sender] = _colorHex;
        allColors.push(_colorHex);

        emit ColorClaimed(msg.sender, _colorHex, msg.value);
    }

    function getColorOwner(string memory _colorHex) public view returns (address) {
        return colorOwner[_colorHex];
    }

    function getMyColor() public view returns (string memory) {
        return ownerColor[msg.sender];
    }

    function getAllColors() public view returns (string[] memory) {
        return allColors;
    }

    function getAllColorsWithOwners()
        public
        view
        returns (string[] memory, address[] memory)
    {
        address[] memory owners = new address[](allColors.length);
        for (uint256 i = 0; i < allColors.length; i++) {
            owners[i] = colorOwner[allColors[i]];
        }
        return (allColors, owners);
    }

    function withdrawFees() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function updateFee(uint256 _newFee) public onlyOwner {
        claimFee = _newFee;
    }
}
