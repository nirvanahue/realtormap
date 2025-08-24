// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RealtyNFT is ERC721, Ownable {
    uint256 public nextId;
    mapping(uint256 => bool) public visible;
    mapping(uint256 => bool) public sold;
    
    event VisibilityChanged(uint256 indexed tokenId, bool visible);
    event MarkedSold(uint256 indexed tokenId);

    constructor() ERC721("RealtyNFT", "RLTY") Ownable(msg.sender) {}

    function mintTo(address to) external onlyOwner returns (uint256) {
        uint256 id = ++nextId;
        _mint(to, id);
        visible[id] = true;
        return id;
    }

    function toggleVisibility(uint256 tokenId, bool v) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        visible[tokenId] = v;
        emit VisibilityChanged(tokenId, v);
    }

    function markSold(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        sold[tokenId] = true;
        emit MarkedSold(tokenId);
    }
} 